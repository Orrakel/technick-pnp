import hashlib
import json
import math
import re
import secrets
import shutil
import sqlite3
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
CHARACTER_SHEET_PDF_DIR = DATA_DIR / "character_sheets" / "pdf"
MAP_DIR = DATA_DIR / "map"
MAP_PIN_DIR = MAP_DIR / "pins"
MAP_SOUND_DIR = MAP_DIR / "sounds"
MAP_OVERLAY_DIR = MAP_DIR / "overlays"
MAP_LAYER_DIR = MAP_DIR / "layers"
MUSIC_DIR = DATA_DIR / "music"
BATTLEMAP_DIR = DATA_DIR / "battlemaps"
BATTLEMAP_TOKEN_DIR = BATTLEMAP_DIR / "tokens"
DB_PATH = DATA_DIR / "eldran.db"
MAP_IMAGE_SETTING_KEY = "map_image_name"
MAP_IMAGE_UPDATED_AT_SETTING_KEY = "map_image_updated_at"
MAP_DRAWINGS_UPDATED_AT_SETTING_KEY = "map_drawings_updated_at"
MAP_PINGS_UPDATED_AT_SETTING_KEY = "map_pings_updated_at"
MAP_PINS_UPDATED_AT_SETTING_KEY = "map_pins_updated_at"
MAP_OVERLAYS_UPDATED_AT_SETTING_KEY = "map_overlays_updated_at"
MAP_FOG_UPDATED_AT_SETTING_KEY = "map_fog_updated_at"
ACTIVE_MAP_ID_SETTING_KEY = "active_map_id"
ACTIVE_BATTLEMAP_ID_SETTING_KEY = "active_battlemap_id"
ACTIVE_SURFACE_KIND_SETTING_KEY = "active_surface_kind"
ACTIVE_SURFACE_ID_SETTING_KEY = "active_surface_id"
ACTIVE_PROJECT_ID_SETTING_KEY = "active_project_id"
PUBLIC_LAYER = "public"
GM_LAYER = "gm"
AUTH_SALT_BYTES = 16
AUTH_ITERATIONS = 200_000
DEFAULT_USER_ROLE = "spieler"
ALLOWED_USER_ROLES = {"spieler", "spielleiter", "admin"}
MAP_PING_TTL_SECONDS = 3.0
DEFAULT_MAP_TOKEN_VISION_RADIUS = 0.18
DEFAULT_BATTLEMAP_TOKEN_VISION_RANGE = 6
DEFAULT_MAP_NAME = "Karte 1"
DEFAULT_BATTLEMAP_NAME = "Test Battlemap"
DEFAULT_PROJECT_NAME = "Projekt 1"
DEFAULT_PROJECT_RULESET = "dnd"
ALLOWED_PROJECT_RULESETS = {"dnd", "nova_gaia"}
DEFAULT_BATTLEMAP_OBSTACLE_COLOR = "#7f858c"
MUSIC_STATE_SETTING_KEY = "music_state"
MAP_SOUND_CUE_SETTING_KEY = "map_sound_cue"
ALLOWED_MUSIC_EXTENSIONS = {".mp3", ".ogg", ".wav", ".m4a", ".aac", ".mp4", ".webm"}

MARKDOWN_EXTENSION = ".md"
TEXT_EXTENSIONS = {MARKDOWN_EXTENSION}
WORD_PATTERN = re.compile(r"\w+", re.UNICODE)
MAX_PASSAGE_CHARS = 1200
READONLY_SQL_PREFIXES = ("select", "with", "pragma")
RAG_PACKAGE_CHUNKS_FILE = "chunks.jsonl"
RAG_PACKAGE_DOCUMENTS_FILE = "documents.json"
VALIDATION_STATUS_VALID = "valid"
VALIDATION_STATUS_EMPTY = "empty"
VALIDATION_STATUS_REVIEW = "review"
WIKI_SOURCE_KIND_EXPLICIT = "explicit"
WIKI_SOURCE_KIND_MENTION = "mention"
GERMAN_STOP_WORDS = {
    "aber", "als", "also", "am", "an", "auch", "auf", "aus", "bei", "bin", "bis", "bist", "da",
    "dadurch", "daher", "darum", "das", "dass", "dein", "deine", "dem", "den", "der", "des", "dessen",
    "deshalb", "die", "dies", "diese", "diesem", "diesen", "dieser", "dieses", "doch", "dort", "du",
    "durch", "ein", "eine", "einem", "einen", "einer", "eines", "er", "es", "euer", "eure", "fuer",
    "für", "hat", "hatte", "hier", "hinter", "ich", "ihr", "ihre", "im", "in", "ist", "jede", "jeder",
    "jedes", "jener", "jenes", "kann", "kein", "keine", "mit", "nach", "nicht", "noch", "nun", "oder",
    "seid", "sein", "seine", "sich", "sie", "sind", "so", "solche", "soll", "sollen", "sollte", "sondern",
    "sonst", "ueber", "über", "um", "und", "uns", "unser", "unter", "vom", "von", "vor", "war", "waren",
    "was", "weg", "weil", "wenn", "wer", "werde", "werden", "wie", "wieder", "wir", "wird", "wo", "zu",
    "zum", "zur", "zwar", "zwischen",
}


def init_storage() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    CHARACTER_SHEET_PDF_DIR.mkdir(parents=True, exist_ok=True)
    MAP_DIR.mkdir(parents=True, exist_ok=True)
    MAP_PIN_DIR.mkdir(parents=True, exist_ok=True)
    MAP_SOUND_DIR.mkdir(parents=True, exist_ok=True)
    MAP_OVERLAY_DIR.mkdir(parents=True, exist_ok=True)
    MAP_LAYER_DIR.mkdir(parents=True, exist_ok=True)
    MUSIC_DIR.mkdir(parents=True, exist_ok=True)
    BATTLEMAP_DIR.mkdir(parents=True, exist_ok=True)
    BATTLEMAP_TOKEN_DIR.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS app_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                ruleset TEXT NOT NULL DEFAULT 'dnd',
                owner_user_id TEXT NOT NULL DEFAULT '',
                owner_username TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS project_players (
                project_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                assigned_at TEXT NOT NULL,
                assigned_by_user_id TEXT NOT NULL DEFAULT '',
                assigned_by_username TEXT NOT NULL DEFAULT '',
                PRIMARY KEY (project_id, user_id),
                FOREIGN KEY (project_id) REFERENCES projects (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS character_sheets (
                project_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                character_name TEXT NOT NULL DEFAULT '',
                volk TEXT NOT NULL DEFAULT '',
                level INTEGER NOT NULL DEFAULT 1,
                data_json TEXT NOT NULL DEFAULT '{}',
                pdf_file_name TEXT NOT NULL DEFAULT '',
                pdf_original_name TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (project_id, user_id),
                FOREIGN KEY (project_id) REFERENCES projects (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS import_batches (
                id TEXT PRIMARY KEY,
                source_type TEXT NOT NULL,
                source_path TEXT,
                imported_at TEXT NOT NULL,
                imported_count INTEGER NOT NULL DEFAULT 0,
                skipped_count INTEGER NOT NULL DEFAULT 0
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                import_batch_id TEXT,
                source_type TEXT NOT NULL,
                source_path TEXT,
                stored_name TEXT,
                display_name TEXT NOT NULL,
                extension TEXT,
                content_type TEXT,
                size_bytes INTEGER NOT NULL,
                checksum_sha256 TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (import_batch_id) REFERENCES import_batches (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS passages (
                id TEXT PRIMARY KEY,
                content_hash TEXT NOT NULL UNIQUE,
                canonical_text TEXT NOT NULL,
                searchable_text TEXT NOT NULL,
                word_count INTEGER NOT NULL,
                char_count INTEGER NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS document_passages (
                id TEXT PRIMARY KEY,
                document_id TEXT NOT NULL,
                passage_id TEXT NOT NULL,
                passage_index INTEGER NOT NULL,
                section_label TEXT,
                start_offset INTEGER NOT NULL,
                end_offset INTEGER NOT NULL,
                UNIQUE(document_id, passage_id, passage_index),
                FOREIGN KEY (document_id) REFERENCES documents (id),
                FOREIGN KEY (passage_id) REFERENCES passages (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS document_elements (
                id TEXT PRIMARY KEY,
                document_id TEXT NOT NULL,
                element_index INTEGER NOT NULL,
                element_type TEXT NOT NULL,
                section_level INTEGER NOT NULL DEFAULT 0,
                section_label TEXT NOT NULL DEFAULT '',
                section_path_json TEXT NOT NULL DEFAULT '[]',
                content TEXT NOT NULL,
                char_count INTEGER NOT NULL DEFAULT 0,
                start_offset INTEGER NOT NULL DEFAULT 0,
                end_offset INTEGER NOT NULL DEFAULT 0,
                metadata_json TEXT NOT NULL DEFAULT '{}',
                validation_status TEXT NOT NULL DEFAULT 'valid',
                created_at TEXT NOT NULL,
                UNIQUE(document_id, element_index),
                FOREIGN KEY (document_id) REFERENCES documents (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS extracted_facts (
                id TEXT PRIMARY KEY,
                document_id TEXT NOT NULL,
                element_id TEXT NOT NULL,
                fact_index INTEGER NOT NULL,
                fact_key TEXT NOT NULL,
                fact_value TEXT NOT NULL,
                normalized_key TEXT NOT NULL,
                normalized_value TEXT NOT NULL,
                source_kind TEXT NOT NULL DEFAULT 'generic',
                validation_status TEXT NOT NULL DEFAULT 'valid',
                created_at TEXT NOT NULL,
                UNIQUE(document_id, element_id, fact_index),
                FOREIGN KEY (document_id) REFERENCES documents (id),
                FOREIGN KEY (element_id) REFERENCES document_elements (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS wiki_pages (
                id TEXT PRIMARY KEY,
                document_id TEXT NOT NULL UNIQUE,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                markdown_content TEXT NOT NULL,
                source_path TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (document_id) REFERENCES documents (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS wiki_links (
                id TEXT PRIMARY KEY,
                source_page_id TEXT NOT NULL,
                target_slug TEXT NOT NULL,
                target_page_id TEXT,
                link_label TEXT NOT NULL,
                link_kind TEXT NOT NULL DEFAULT 'explicit',
                created_at TEXT NOT NULL,
                FOREIGN KEY (source_page_id) REFERENCES wiki_pages (id),
                FOREIGN KEY (target_page_id) REFERENCES wiki_pages (id)
            )
            """
        )
        connection.execute(
            """
            CREATE VIEW IF NOT EXISTS document_overview AS
            SELECT
                d.id,
                d.display_name AS original_name,
                d.source_type,
                d.source_path,
                d.content_type,
                d.extension,
                d.size_bytes,
                CASE WHEN COUNT(dp.id) > 0 THEN 1 ELSE 0 END AS has_text,
                d.created_at,
                d.updated_at,
                COUNT(dp.id) AS chunk_count,
                COUNT(DISTINCT dp.passage_id) AS unique_passage_count
            FROM documents d
            LEFT JOIN document_passages dp ON dp.document_id = d.id
            GROUP BY d.id
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS chats (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL DEFAULT '',
                title TEXT NOT NULL,
                scope TEXT NOT NULL DEFAULT 'local',
                client_id TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS chat_messages (
                id TEXT PRIMARY KEY,
                chat_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                sources_json TEXT NOT NULL DEFAULT '[]',
                sort_order INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chats (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS command_messages (
                id TEXT PRIMARY KEY,
                role TEXT NOT NULL,
                username TEXT NOT NULL DEFAULT '',
                content TEXT NOT NULL,
                visibility TEXT NOT NULL DEFAULT 'public',
                recipient_username TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS music_tracks (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL DEFAULT '',
                file_name TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                extension TEXT NOT NULL DEFAULT '',
                content_type TEXT NOT NULL DEFAULT '',
                size_bytes INTEGER NOT NULL DEFAULT 0,
                uploaded_by TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                role TEXT NOT NULL DEFAULT 'spieler',
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS user_sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS maps (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL DEFAULT '',
                name TEXT NOT NULL,
                image_name TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS battlemaps (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL DEFAULT '',
                name TEXT NOT NULL,
                background_image_name TEXT,
                grid_width INTEGER NOT NULL DEFAULT 12,
                grid_height INTEGER NOT NULL DEFAULT 8,
                cell_size INTEGER NOT NULL DEFAULT 64,
                scale_percent INTEGER NOT NULL DEFAULT 100,
                obstacle_color TEXT NOT NULL DEFAULT '#7f858c',
                fog_enabled INTEGER NOT NULL DEFAULT 0,
                fog_walls_json TEXT NOT NULL DEFAULT '[]',
                fog_doors_json TEXT NOT NULL DEFAULT '[]',
                round_number INTEGER NOT NULL DEFAULT 1,
                obstacles_json TEXT NOT NULL DEFAULT '[]',
                tokens_json TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_layers (
                id TEXT PRIMARY KEY,
                map_id TEXT NOT NULL,
                name TEXT NOT NULL,
                image_name TEXT,
                background_color TEXT NOT NULL DEFAULT '#223044',
                canvas_width INTEGER NOT NULL DEFAULT 4096,
                canvas_height INTEGER NOT NULL DEFAULT 4096,
                sort_order INTEGER NOT NULL DEFAULT 0,
                is_default INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (map_id) REFERENCES maps (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_draw_strokes (
                id TEXT PRIMARY KEY,
                map_id TEXT NOT NULL DEFAULT '',
                layer_id TEXT NOT NULL DEFAULT '',
                username TEXT NOT NULL DEFAULT '',
                color TEXT NOT NULL,
                width REAL NOT NULL,
                points_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_pings (
                id TEXT PRIMARY KEY,
                map_id TEXT NOT NULL DEFAULT '',
                layer_id TEXT NOT NULL DEFAULT '',
                username TEXT NOT NULL DEFAULT '',
                color TEXT NOT NULL,
                x REAL NOT NULL,
                y REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_pins (
                id TEXT PRIMARY KEY,
                map_id TEXT NOT NULL DEFAULT '',
                layer_id TEXT NOT NULL DEFAULT '',
                username TEXT NOT NULL DEFAULT '',
                name TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                image_name TEXT,
                pin_type TEXT NOT NULL DEFAULT 'pin',
                assigned_user_id TEXT NOT NULL DEFAULT '',
                assigned_username TEXT NOT NULL DEFAULT '',
                sound_name TEXT NOT NULL DEFAULT '',
                sound_title TEXT NOT NULL DEFAULT '',
                target_map_id TEXT NOT NULL DEFAULT '',
                target_kind TEXT NOT NULL DEFAULT '',
                target_id TEXT NOT NULL DEFAULT '',
                group_id TEXT NOT NULL DEFAULT '',
                show_label INTEGER NOT NULL DEFAULT 1,
                hidden_from_players INTEGER NOT NULL DEFAULT 0,
                visibility_layer TEXT NOT NULL DEFAULT 'public',
                vision_radius REAL NOT NULL DEFAULT 0.18,
                x REAL NOT NULL,
                y REAL NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT ''
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_overlays (
                id TEXT PRIMARY KEY,
                map_id TEXT NOT NULL DEFAULT '',
                layer_id TEXT NOT NULL DEFAULT '',
                username TEXT NOT NULL DEFAULT '',
                image_name TEXT NOT NULL,
                x REAL NOT NULL,
                y REAL NOT NULL,
                width REAL NOT NULL,
                height REAL NOT NULL,
                visibility_layer TEXT NOT NULL DEFAULT 'public',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_layer_fog_settings (
                map_id TEXT NOT NULL,
                layer_id TEXT NOT NULL,
                enabled INTEGER NOT NULL DEFAULT 0,
                explored_areas_json TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (map_id, layer_id),
                FOREIGN KEY (map_id) REFERENCES maps (id),
                FOREIGN KEY (layer_id) REFERENCES map_layers (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_layer_fog_walls (
                id TEXT PRIMARY KEY,
                map_id TEXT NOT NULL,
                layer_id TEXT NOT NULL,
                x1 REAL NOT NULL,
                y1 REAL NOT NULL,
                x2 REAL NOT NULL,
                y2 REAL NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (map_id) REFERENCES maps (id),
                FOREIGN KEY (layer_id) REFERENCES map_layers (id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS map_layer_fog_doors (
                id TEXT PRIMARY KEY,
                map_id TEXT NOT NULL,
                layer_id TEXT NOT NULL,
                x1 REAL NOT NULL,
                y1 REAL NOT NULL,
                x2 REAL NOT NULL,
                y2 REAL NOT NULL,
                is_open INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (map_id) REFERENCES maps (id),
                FOREIGN KEY (layer_id) REFERENCES map_layers (id)
            )
            """
        )
        chat_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(chats)").fetchall()
        }
        map_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(maps)").fetchall()
        }
        music_track_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(music_tracks)").fetchall()
        }
        command_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(command_messages)").fetchall()
        }
        user_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(users)").fetchall()
        }
        project_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(projects)").fetchall()
        }
        project_player_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(project_players)").fetchall()
        }
        character_sheet_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(character_sheets)").fetchall()
        }
        draw_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(map_draw_strokes)").fetchall()
        }
        ping_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(map_pings)").fetchall()
        }
        pin_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(map_pins)").fetchall()
        }
        overlay_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(map_overlays)").fetchall()
        }
        map_layer_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(map_layers)").fetchall()
        }
        fog_setting_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(map_layer_fog_settings)").fetchall()
        }
        battlemap_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(battlemaps)").fetchall()
        }
        if "scope" not in chat_columns:
            connection.execute("ALTER TABLE chats ADD COLUMN scope TEXT NOT NULL DEFAULT 'local'")
        if "client_id" not in chat_columns:
            connection.execute("ALTER TABLE chats ADD COLUMN client_id TEXT NOT NULL DEFAULT ''")
        if "project_id" not in chat_columns:
            connection.execute("ALTER TABLE chats ADD COLUMN project_id TEXT NOT NULL DEFAULT ''")
        if "project_id" not in map_columns:
            connection.execute("ALTER TABLE maps ADD COLUMN project_id TEXT NOT NULL DEFAULT ''")
        if "project_id" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN project_id TEXT NOT NULL DEFAULT ''")
        if "project_id" not in music_track_columns:
            connection.execute("ALTER TABLE music_tracks ADD COLUMN project_id TEXT NOT NULL DEFAULT ''")
        if "owner_user_id" not in project_columns:
            connection.execute("ALTER TABLE projects ADD COLUMN owner_user_id TEXT NOT NULL DEFAULT ''")
        if "owner_username" not in project_columns:
            connection.execute("ALTER TABLE projects ADD COLUMN owner_username TEXT NOT NULL DEFAULT ''")
        if "ruleset" not in project_columns:
            connection.execute(f"ALTER TABLE projects ADD COLUMN ruleset TEXT NOT NULL DEFAULT '{DEFAULT_PROJECT_RULESET}'")
        if "assigned_by_user_id" not in project_player_columns:
            connection.execute("ALTER TABLE project_players ADD COLUMN assigned_by_user_id TEXT NOT NULL DEFAULT ''")
        if "assigned_by_username" not in project_player_columns:
            connection.execute("ALTER TABLE project_players ADD COLUMN assigned_by_username TEXT NOT NULL DEFAULT ''")
        if "pdf_file_name" not in character_sheet_columns:
            connection.execute("ALTER TABLE character_sheets ADD COLUMN pdf_file_name TEXT NOT NULL DEFAULT ''")
        if "pdf_original_name" not in character_sheet_columns:
            connection.execute("ALTER TABLE character_sheets ADD COLUMN pdf_original_name TEXT NOT NULL DEFAULT ''")
        if "username" not in command_columns:
            connection.execute("ALTER TABLE command_messages ADD COLUMN username TEXT NOT NULL DEFAULT ''")
        if "visibility" not in command_columns:
            connection.execute("ALTER TABLE command_messages ADD COLUMN visibility TEXT NOT NULL DEFAULT 'public'")
        if "recipient_username" not in command_columns:
            connection.execute("ALTER TABLE command_messages ADD COLUMN recipient_username TEXT NOT NULL DEFAULT ''")
        if "role" not in user_columns:
            connection.execute(f"ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT '{DEFAULT_USER_ROLE}'")
        if "map_id" not in draw_columns:
            connection.execute("ALTER TABLE map_draw_strokes ADD COLUMN map_id TEXT NOT NULL DEFAULT ''")
        if "layer_id" not in draw_columns:
            connection.execute("ALTER TABLE map_draw_strokes ADD COLUMN layer_id TEXT NOT NULL DEFAULT ''")
        if "map_id" not in ping_columns:
            connection.execute("ALTER TABLE map_pings ADD COLUMN map_id TEXT NOT NULL DEFAULT ''")
        if "layer_id" not in ping_columns:
            connection.execute("ALTER TABLE map_pings ADD COLUMN layer_id TEXT NOT NULL DEFAULT ''")
        if "map_id" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN map_id TEXT NOT NULL DEFAULT ''")
        if "layer_id" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN layer_id TEXT NOT NULL DEFAULT ''")
        if "show_label" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN show_label INTEGER NOT NULL DEFAULT 1")
        if "hidden_from_players" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN hidden_from_players INTEGER NOT NULL DEFAULT 0")
        if "visibility_layer" not in pin_columns:
            connection.execute(f"ALTER TABLE map_pins ADD COLUMN visibility_layer TEXT NOT NULL DEFAULT '{PUBLIC_LAYER}'")
            connection.execute(
                f"UPDATE map_pins SET visibility_layer = '{GM_LAYER}' WHERE hidden_from_players = 1"
            )
        if "vision_radius" not in pin_columns:
            connection.execute(
                f"ALTER TABLE map_pins ADD COLUMN vision_radius REAL NOT NULL DEFAULT {DEFAULT_MAP_TOKEN_VISION_RADIUS}"
            )
        if "pin_type" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN pin_type TEXT NOT NULL DEFAULT 'pin'")
        if "assigned_user_id" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN assigned_user_id TEXT NOT NULL DEFAULT ''")
        if "assigned_username" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN assigned_username TEXT NOT NULL DEFAULT ''")
        if "sound_name" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN sound_name TEXT NOT NULL DEFAULT ''")
        if "sound_title" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN sound_title TEXT NOT NULL DEFAULT ''")
        if "target_map_id" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN target_map_id TEXT NOT NULL DEFAULT ''")
        if "target_kind" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN target_kind TEXT NOT NULL DEFAULT ''")
        if "target_id" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN target_id TEXT NOT NULL DEFAULT ''")
        connection.execute(
            """
            UPDATE map_pins
            SET target_kind = 'map', target_id = target_map_id
            WHERE target_map_id != '' AND target_id = ''
            """
        )
        if "group_id" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN group_id TEXT NOT NULL DEFAULT ''")
        if "updated_at" not in pin_columns:
            connection.execute("ALTER TABLE map_pins ADD COLUMN updated_at TEXT NOT NULL DEFAULT ''")
            connection.execute("UPDATE map_pins SET updated_at = created_at WHERE updated_at = ''")
        if "map_id" not in overlay_columns:
            connection.execute("ALTER TABLE map_overlays ADD COLUMN map_id TEXT NOT NULL DEFAULT ''")
        if "layer_id" not in overlay_columns:
            connection.execute("ALTER TABLE map_overlays ADD COLUMN layer_id TEXT NOT NULL DEFAULT ''")
        if "visibility_layer" not in overlay_columns:
            connection.execute(f"ALTER TABLE map_overlays ADD COLUMN visibility_layer TEXT NOT NULL DEFAULT '{PUBLIC_LAYER}'")
        if "sort_order" not in map_layer_columns:
            connection.execute("ALTER TABLE map_layers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0")
        if "is_default" not in map_layer_columns:
            connection.execute("ALTER TABLE map_layers ADD COLUMN is_default INTEGER NOT NULL DEFAULT 0")
        if "background_color" not in map_layer_columns:
            connection.execute("ALTER TABLE map_layers ADD COLUMN background_color TEXT NOT NULL DEFAULT '#223044'")
        if "canvas_width" not in map_layer_columns:
            connection.execute("ALTER TABLE map_layers ADD COLUMN canvas_width INTEGER NOT NULL DEFAULT 4096")
        if "canvas_height" not in map_layer_columns:
            connection.execute("ALTER TABLE map_layers ADD COLUMN canvas_height INTEGER NOT NULL DEFAULT 4096")
        if "explored_areas_json" not in fog_setting_columns:
            connection.execute("ALTER TABLE map_layer_fog_settings ADD COLUMN explored_areas_json TEXT NOT NULL DEFAULT '[]'")
        if "background_image_name" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN background_image_name TEXT")
        if "grid_width" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN grid_width INTEGER NOT NULL DEFAULT 12")
        if "grid_height" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN grid_height INTEGER NOT NULL DEFAULT 8")
        if "cell_size" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN cell_size INTEGER NOT NULL DEFAULT 64")
        if "scale_percent" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN scale_percent INTEGER NOT NULL DEFAULT 100")
        if "obstacle_color" not in battlemap_columns:
            connection.execute(
                f"ALTER TABLE battlemaps ADD COLUMN obstacle_color TEXT NOT NULL DEFAULT '{DEFAULT_BATTLEMAP_OBSTACLE_COLOR}'"
            )
        if "fog_enabled" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN fog_enabled INTEGER NOT NULL DEFAULT 0")
        if "fog_walls_json" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN fog_walls_json TEXT NOT NULL DEFAULT '[]'")
        if "fog_doors_json" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN fog_doors_json TEXT NOT NULL DEFAULT '[]'")
        if "round_number" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN round_number INTEGER NOT NULL DEFAULT 1")
        if "obstacles_json" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN obstacles_json TEXT NOT NULL DEFAULT '[]'")
        if "tokens_json" not in battlemap_columns:
            connection.execute("ALTER TABLE battlemaps ADD COLUMN tokens_json TEXT NOT NULL DEFAULT '[]'")
        _ensure_default_project(connection)
        _ensure_default_map(connection)
        _ensure_map_layers(connection)
        _ensure_map_content_layers(connection)
        _ensure_map_fog_settings(connection)
        _ensure_default_battlemap(connection)
        connection.commit()


def get_setting(key: str, default: str = "") -> str:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row = connection.execute(
            "SELECT value FROM app_settings WHERE key = ?",
            (key,),
        ).fetchone()
    return row[0] if row else default


def _ensure_default_project(connection: sqlite3.Connection) -> str:
    connection.row_factory = sqlite3.Row
    rows = connection.execute(
        "SELECT id, name, created_at, updated_at FROM projects ORDER BY datetime(created_at) ASC, created_at ASC"
    ).fetchall()
    active_row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (ACTIVE_PROJECT_ID_SETTING_KEY,),
    ).fetchone()
    active_project_id = str(active_row[0] if active_row else "").strip()
    if rows:
        valid_project_ids = {str(row["id"]) for row in rows}
        current_project_id = active_project_id if active_project_id in valid_project_ids else str(rows[0]["id"])
    else:
        current_project_id = uuid4().hex
        timestamp = datetime.now(timezone.utc).isoformat()
        connection.execute(
            "INSERT INTO projects (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (current_project_id, DEFAULT_PROJECT_NAME, timestamp, timestamp),
        )
    _upsert_setting(connection, ACTIVE_PROJECT_ID_SETTING_KEY, current_project_id)
    connection.execute("UPDATE chats SET project_id = ? WHERE project_id = ''", (current_project_id,))
    connection.execute("UPDATE maps SET project_id = ? WHERE project_id = ''", (current_project_id,))
    connection.execute("UPDATE battlemaps SET project_id = ? WHERE project_id = ''", (current_project_id,))
    connection.execute("UPDATE music_tracks SET project_id = ? WHERE project_id = ''", (current_project_id,))
    return current_project_id


def _get_active_project_id(connection: sqlite3.Connection) -> str:
    row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (ACTIVE_PROJECT_ID_SETTING_KEY,),
    ).fetchone()
    active_project_id = str(row[0] if row else "").strip()
    if active_project_id:
        existing = connection.execute("SELECT id FROM projects WHERE id = ?", (active_project_id,)).fetchone()
        if existing:
            return active_project_id
    return _ensure_default_project(connection)


def _set_active_project_id(connection: sqlite3.Connection, project_id: str) -> None:
    _upsert_setting(connection, ACTIVE_PROJECT_ID_SETTING_KEY, project_id)


def _resolve_project_id(connection: sqlite3.Connection, project_id: str | None = None) -> str:
    normalized = str(project_id or "").strip()
    if normalized:
        row = connection.execute("SELECT id FROM projects WHERE id = ?", (normalized,)).fetchone()
        if row:
            return normalized
        raise ValueError("Projekt nicht gefunden.")
    return _get_active_project_id(connection)


def _project_setting_key(base_key: str, project_id: str) -> str:
    return f"{base_key}:project:{project_id}"


def _project_owner_from_user(user: dict[str, str] | None) -> tuple[str, str]:
    if not user:
        return "", ""
    return str(user.get("id") or "").strip(), str(user.get("username") or "").strip()


def _normalize_project_ruleset(value: str | None) -> str:
    normalized = str(value or DEFAULT_PROJECT_RULESET).strip().lower().replace("-", "_")
    if normalized in {"dnd", "dungeons_and_dragons", "dungeons_dragons"}:
        return "dnd"
    if normalized in {"nova_gaia", "novagaia"}:
        return "nova_gaia"
    raise ValueError("Regelwerk nicht gefunden.")


def _user_can_access_project_row(row: sqlite3.Row, user: dict[str, str] | None) -> bool:
    if not user:
        return True
    role = str(user.get("role") or "").strip().lower()
    if role == "admin":
        return True
    if role != "spielleiter":
        return False
    owner_user_id, owner_username = _project_owner_from_user(user)
    row_owner_user_id = str(row["owner_user_id"] or "").strip()
    row_owner_username = str(row["owner_username"] or "").strip().lower()
    if owner_user_id and row_owner_user_id and owner_user_id == row_owner_user_id:
        return True
    return bool(owner_username and row_owner_username and owner_username.lower() == row_owner_username)


def _get_project_row(connection: sqlite3.Connection, project_id: str) -> sqlite3.Row | None:
    return connection.execute(
        """
        SELECT id, name, ruleset, owner_user_id, owner_username, created_at, updated_at
        FROM projects
        WHERE id = ?
        """,
        (str(project_id or "").strip(),),
    ).fetchone()


def list_projects(user: dict[str, str] | None = None) -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        current_project_id = _get_active_project_id(connection)
        rows = connection.execute(
            """
            SELECT id, name, ruleset, owner_user_id, owner_username, created_at, updated_at
            FROM projects
            ORDER BY name COLLATE NOCASE ASC
            """
        ).fetchall()
    visible_rows = [row for row in rows if _user_can_access_project_row(row, user)]
    visible_project_ids = {str(row["id"]) for row in visible_rows}
    visible_active_project_id = current_project_id if current_project_id in visible_project_ids else (str(visible_rows[0]["id"]) if visible_rows else "")
    return {
        "projects": [
            {
                "id": str(row["id"]),
                "name": str(row["name"]),
                "ruleset": str(row["ruleset"] or DEFAULT_PROJECT_RULESET),
                "owner_user_id": str(row["owner_user_id"] or ""),
                "owner_username": str(row["owner_username"] or ""),
                "created_at": str(row["created_at"]),
                "updated_at": str(row["updated_at"]),
                "is_active": str(row["id"]) == visible_active_project_id,
            }
            for row in visible_rows
        ],
        "active_project_id": visible_active_project_id,
    }


def create_project(name: str, created_by: dict[str, str] | None = None, ruleset: str | None = None) -> dict[str, str]:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Projektname darf nicht leer sein.")
    normalized_ruleset = _normalize_project_ruleset(ruleset)
    project_id = uuid4().hex
    timestamp = datetime.now(timezone.utc).isoformat()
    owner_user_id, owner_username = _project_owner_from_user(created_by)
    with sqlite3.connect(DB_PATH) as connection:
        try:
            connection.execute(
                """
                INSERT INTO projects (id, name, ruleset, owner_user_id, owner_username, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (project_id, normalized_name, normalized_ruleset, owner_user_id, owner_username, timestamp, timestamp),
            )
        except sqlite3.IntegrityError as exc:
            raise ValueError("Projektname existiert bereits.") from exc
        connection.commit()
    return {
        "id": project_id,
        "name": normalized_name,
        "ruleset": normalized_ruleset,
        "owner_user_id": owner_user_id,
        "owner_username": owner_username,
        "created_at": timestamp,
        "updated_at": timestamp,
    }


def set_active_project(project_id: str, user: dict[str, str] | None = None) -> dict[str, str]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_project_id = _resolve_project_id(connection, project_id)
        project_row = connection.execute(
            "SELECT id, name, ruleset, owner_user_id, owner_username, created_at, updated_at FROM projects WHERE id = ?",
            (resolved_project_id,),
        ).fetchone()
        if not project_row or not _user_can_access_project_row(project_row, user):
            raise ValueError("Projekt nicht gefunden.")
        _set_active_project_id(connection, resolved_project_id)
        connection.commit()
    return {
        "id": str(project_row["id"]),
        "name": str(project_row["name"]),
        "ruleset": str(project_row["ruleset"] or DEFAULT_PROJECT_RULESET),
        "owner_user_id": str(project_row["owner_user_id"] or ""),
        "owner_username": str(project_row["owner_username"] or ""),
        "created_at": str(project_row["created_at"]),
        "updated_at": str(project_row["updated_at"]),
    }


def list_project_players(project_id: str, user: dict[str, str] | None = None) -> list[dict[str, str | bool]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _get_project_row(connection, project_id)
        if not project_row or not _user_can_access_project_row(project_row, user):
            raise ValueError("Projekt nicht gefunden.")
        assigned_rows = connection.execute(
            """
            SELECT user_id
            FROM project_players
            WHERE project_id = ?
            """,
            (project_id,),
        ).fetchall()
        assigned_user_ids = {str(row["user_id"]) for row in assigned_rows}
        user_rows = connection.execute(
            """
            SELECT id, username, role, created_at
            FROM users
            WHERE role = 'spieler'
            ORDER BY username COLLATE NOCASE
            """
        ).fetchall()
    return [
        {
            "id": str(row["id"]),
            "username": str(row["username"]),
            "role": str(row["role"]),
            "created_at": str(row["created_at"]),
            "is_assigned": str(row["id"]) in assigned_user_ids,
        }
        for row in user_rows
    ]


def set_project_player_assignment(project_id: str, user_id: str, assigned: bool, acting_user: dict[str, str] | None = None) -> dict[str, object]:
    normalized_project_id = str(project_id or "").strip()
    normalized_user_id = str(user_id or "").strip()
    if not normalized_project_id or not normalized_user_id:
        raise ValueError("Projekt oder Spieler fehlt.")
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _get_project_row(connection, normalized_project_id)
        if not project_row or not _user_can_access_project_row(project_row, acting_user):
            raise ValueError("Projekt nicht gefunden.")
        user_row = connection.execute(
            """
            SELECT id, username, role, created_at
            FROM users
            WHERE id = ?
            """,
            (normalized_user_id,),
        ).fetchone()
        if not user_row or str(user_row["role"]) != "spieler":
            raise ValueError("Spieler nicht gefunden.")
        if assigned:
            assigned_at = datetime.now(timezone.utc).isoformat()
            acting_user_id, acting_username = _project_owner_from_user(acting_user)
            connection.execute(
                """
                INSERT INTO project_players (project_id, user_id, assigned_at, assigned_by_user_id, assigned_by_username)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(project_id, user_id) DO UPDATE SET
                    assigned_at = excluded.assigned_at,
                    assigned_by_user_id = excluded.assigned_by_user_id,
                    assigned_by_username = excluded.assigned_by_username
                """,
                (normalized_project_id, normalized_user_id, assigned_at, acting_user_id, acting_username),
            )
        else:
            connection.execute(
                "DELETE FROM project_players WHERE project_id = ? AND user_id = ?",
                (normalized_project_id, normalized_user_id),
            )
        connection.commit()
    return {
        "project_id": normalized_project_id,
        "user_id": normalized_user_id,
        "assigned": bool(assigned),
    }


def _player_is_assigned_to_project(connection: sqlite3.Connection, project_id: str, user_id: str) -> bool:
    return connection.execute(
        """
        SELECT 1
        FROM project_players
        WHERE project_id = ? AND user_id = ?
        """,
        (str(project_id or "").strip(), str(user_id or "").strip()),
    ).fetchone() is not None


def _resolve_character_sheet_project_row(
    connection: sqlite3.Connection,
    acting_user: dict[str, str],
    project_id: str = "",
) -> sqlite3.Row:
    connection.row_factory = sqlite3.Row
    role = str(acting_user.get("role") or "").strip().lower()
    normalized_project_id = str(project_id or "").strip()
    if normalized_project_id:
        project_row = _get_project_row(connection, normalized_project_id)
        if not project_row:
            raise ValueError("Projekt nicht gefunden.")
        if role in {"admin", "spielleiter"}:
            if _user_can_access_project_row(project_row, acting_user):
                return project_row
            raise ValueError("Projekt nicht gefunden.")
        acting_user_id = str(acting_user.get("id") or "").strip()
        if role == "spieler" and acting_user_id and _player_is_assigned_to_project(connection, normalized_project_id, acting_user_id):
            return project_row
        raise ValueError("Projekt nicht gefunden.")

    if role in {"admin", "spielleiter"}:
        active_project_id = _get_active_project_id(connection)
        project_row = _get_project_row(connection, active_project_id)
        if project_row and _user_can_access_project_row(project_row, acting_user):
            return project_row
        rows = connection.execute(
            """
            SELECT id, name, ruleset, owner_user_id, owner_username, created_at, updated_at
            FROM projects
            ORDER BY name COLLATE NOCASE ASC
            """
        ).fetchall()
        for row in rows:
            if _user_can_access_project_row(row, acting_user):
                return row
        raise ValueError("Projekt nicht gefunden.")

    acting_user_id = str(acting_user.get("id") or "").strip()
    if role != "spieler" or not acting_user_id:
        raise ValueError("Projekt nicht gefunden.")

    active_project_id = _get_active_project_id(connection)
    project_row = _get_project_row(connection, active_project_id)
    if project_row and _player_is_assigned_to_project(connection, active_project_id, acting_user_id):
        return project_row

    project_row = connection.execute(
        """
        SELECT p.id, p.name, p.ruleset, p.owner_user_id, p.owner_username, p.created_at, p.updated_at
        FROM projects p
        JOIN project_players pp ON pp.project_id = p.id
        WHERE pp.user_id = ?
        ORDER BY p.name COLLATE NOCASE ASC
        LIMIT 1
        """,
        (acting_user_id,),
    ).fetchone()
    if project_row:
        return project_row
    raise ValueError("Kein zugewiesenes Projekt gefunden.")


def _resolve_character_sheet_user_row(
    connection: sqlite3.Connection,
    project_id: str,
    target_user_id: str,
    acting_user: dict[str, str],
) -> sqlite3.Row:
    connection.row_factory = sqlite3.Row
    role = str(acting_user.get("role") or "").strip().lower()
    normalized_target_user_id = str(target_user_id or "").strip()
    acting_user_id = str(acting_user.get("id") or "").strip()

    if role == "spieler":
        if normalized_target_user_id and normalized_target_user_id not in {acting_user_id, "me"}:
            raise ValueError("Spieler nicht gefunden.")
        normalized_target_user_id = acting_user_id
    elif normalized_target_user_id == "me":
        normalized_target_user_id = acting_user_id

    if not normalized_target_user_id:
        raise ValueError("Spieler fehlt.")

    user_row = connection.execute(
        """
        SELECT u.id, u.username, u.role, u.created_at
        FROM users u
        JOIN project_players pp ON pp.user_id = u.id
        WHERE pp.project_id = ?
          AND u.id = ?
          AND u.role = 'spieler'
        """,
        (str(project_id or "").strip(), normalized_target_user_id),
    ).fetchone()
    if not user_row:
        raise ValueError("Spieler nicht gefunden.")
    return user_row


def _sanitize_character_sheet_data(data: dict[str, object]) -> dict[str, object]:
    if not isinstance(data, dict):
        raise ValueError("Charakterbogen-Daten fehlen.")
    try:
        normalized = json.loads(json.dumps(data, ensure_ascii=True))
    except (TypeError, ValueError) as exc:
        raise ValueError("Charakterbogen-Daten sind ungueltig.") from exc
    if not isinstance(normalized, dict):
        raise ValueError("Charakterbogen-Daten sind ungueltig.")
    return normalized


def _character_sheet_summary_fields(data: dict[str, object]) -> tuple[str, str, int]:
    identity = data.get("identity") if isinstance(data.get("identity"), dict) else {}
    character_name = str(identity.get("character_name") or data.get("character_name") or "").strip()
    volk = str(identity.get("volk") or identity.get("species") or data.get("volk") or "").strip()
    raw_level = identity.get("level") if "level" in identity else data.get("level")
    try:
        level = int(raw_level)
    except (TypeError, ValueError):
        level = 1
    level = max(1, min(level, 20))
    return character_name, volk, level


def _project_is_dnd(project_row: sqlite3.Row) -> bool:
    return str(project_row["ruleset"] or DEFAULT_PROJECT_RULESET).strip().lower() == "dnd"


def _sanitize_pdf_filename(file_name: str) -> str:
    sanitized = _sanitize_filename(file_name)
    if not sanitized.lower().endswith(".pdf"):
        raise ValueError("Bitte eine PDF-Datei hochladen.")
    return sanitized


def _empty_dnd_character_sheet() -> dict[str, object]:
    abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
    skills = [
        "acrobatics", "animal_handling", "arcana", "athletics", "deception", "history", "insight",
        "intimidation", "investigation", "medicine", "nature", "perception", "performance",
        "persuasion", "religion", "sleight_of_hand", "stealth", "survival",
    ]
    return {
        "identity": {
            "character_name": "",
            "player_name": "",
            "class_level": "",
            "species": "",
            "background": "",
            "alignment": "",
            "experience_points": "",
            "size": "",
        },
        "abilities": {key: {"score": "", "modifier": "", "save": "", "save_proficient": False} for key in abilities},
        "skills": {key: {"modifier": "", "proficient": False, "expertise": False} for key in skills},
        "combat": {
            "armor_class": "",
            "initiative": "",
            "speed": "",
            "hit_points_max": "",
            "hit_points_current": "",
            "hit_points_temp": "",
            "hit_dice": "",
            "death_saves_successes": "",
            "death_saves_failures": "",
            "proficiency_bonus": "",
            "passive_perception": "",
            "passive_insight": "",
            "passive_investigation": "",
        },
        "attacks": [],
        "spellcasting": {
            "class": "",
            "ability": "",
            "save_dc": "",
            "attack_bonus": "",
            "spells": [],
            "notes": "",
        },
        "resources": {
            "cp": "",
            "sp": "",
            "ep": "",
            "gp": "",
            "pp": "",
            "equipment": "",
            "weight_carried": "",
            "encumbered": "",
            "push_drag_lift": "",
        },
        "features": {
            "features_and_traits": "",
            "additional_features_and_traits": "",
            "proficiencies_and_training": "",
            "senses": "",
            "defenses": "",
        },
        "personality": {
            "traits": "",
            "ideals": "",
            "bonds": "",
            "flaws": "",
            "appearance": "",
            "backstory": "",
            "allies_organizations": "",
            "additional_notes": "",
        },
        "notes": "",
    }


def _normalize_dnd_field_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", str(value or "").lower())


def _first_dnd_field(fields: dict[str, object], *aliases: str) -> str:
    normalized_fields = {_normalize_dnd_field_key(key): str(value or "").strip() for key, value in fields.items()}
    for alias in aliases:
        value = normalized_fields.get(_normalize_dnd_field_key(alias), "")
        if value:
            return value
    return ""


def _truthy_dnd_field(value: str) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "y", "x", "prepared", "checked"}


def _dnd_numbered_indexes(fields: dict[str, object], prefix: str) -> list[int]:
    normalized_prefix = _normalize_dnd_field_key(prefix)
    indexes: set[int] = set()
    for key in fields:
        normalized_key = _normalize_dnd_field_key(key)
        match = re.match(rf"^{re.escape(normalized_prefix)}(\d+)$", normalized_key)
        if match:
            indexes.add(int(match.group(1)))
    return sorted(indexes)


def _populate_dnd_sheet_from_fields(sheet: dict[str, object], fields: dict[str, object]) -> None:
    identity = sheet["identity"]
    identity["character_name"] = _first_dnd_field(fields, "CharacterName", "Character Name", "character_name")
    identity["player_name"] = _first_dnd_field(fields, "PlayerName", "Player Name")
    identity["class_level"] = _first_dnd_field(fields, "ClassLevel", "Class & Level", "ClassLevelBackground")
    identity["species"] = _first_dnd_field(fields, "Species", "Race", "CharacterRace")
    identity["background"] = _first_dnd_field(fields, "Background")
    identity["alignment"] = _first_dnd_field(fields, "Alignment")
    identity["experience_points"] = _first_dnd_field(fields, "ExperiencePoints", "XP", "Experience Points")
    identity["size"] = _first_dnd_field(fields, "Size")

    ability_aliases = {
        "strength": ("Strength", "STR"),
        "dexterity": ("Dexterity", "DEX"),
        "constitution": ("Constitution", "CON"),
        "intelligence": ("Intelligence", "INT"),
        "wisdom": ("Wisdom", "WIS"),
        "charisma": ("Charisma", "CHA"),
    }
    for key, aliases in ability_aliases.items():
        sheet["abilities"][key]["score"] = _first_dnd_field(fields, *(f"{alias}Score" for alias in aliases), *aliases)
        sheet["abilities"][key]["modifier"] = _first_dnd_field(fields, *(f"{alias}Mod" for alias in aliases), *(f"{alias} Modifier" for alias in aliases))
        sheet["abilities"][key]["save"] = _first_dnd_field(fields, *(f"{alias}Save" for alias in aliases), *(f"{alias} Saving Throw" for alias in aliases))

    skill_aliases = {
        "acrobatics": ("Acrobatics",),
        "animal_handling": ("Animal Handling", "AnimalHandling"),
        "arcana": ("Arcana",),
        "athletics": ("Athletics",),
        "deception": ("Deception",),
        "history": ("History",),
        "insight": ("Insight",),
        "intimidation": ("Intimidation",),
        "investigation": ("Investigation",),
        "medicine": ("Medicine",),
        "nature": ("Nature",),
        "perception": ("Perception",),
        "performance": ("Performance",),
        "persuasion": ("Persuasion",),
        "religion": ("Religion",),
        "sleight_of_hand": ("Sleight of Hand", "SleightOfHand"),
        "stealth": ("Stealth",),
        "survival": ("Survival",),
    }
    for key, aliases in skill_aliases.items():
        sheet["skills"][key]["modifier"] = _first_dnd_field(fields, *aliases, *(f"{alias}Mod" for alias in aliases))

    combat = sheet["combat"]
    combat["armor_class"] = _first_dnd_field(fields, "ArmorClass", "AC", "Armor Class")
    combat["initiative"] = _first_dnd_field(fields, "Initiative")
    combat["speed"] = _first_dnd_field(fields, "Speed")
    combat["hit_points_max"] = _first_dnd_field(fields, "MaxHP", "HitPointsMax", "Max Hit Points")
    combat["hit_points_current"] = _first_dnd_field(fields, "CurrentHP", "HitPointsCurrent", "Current Hit Points")
    combat["hit_points_temp"] = _first_dnd_field(fields, "TempHP", "TemporaryHP", "Temporary Hit Points")
    combat["hit_dice"] = _first_dnd_field(fields, "HitDice", "Hit Dice")
    combat["proficiency_bonus"] = _first_dnd_field(fields, "ProficiencyBonus", "Proficiency Bonus")
    combat["passive_perception"] = _first_dnd_field(fields, "PassivePerception", "Passive Perception")
    combat["passive_insight"] = _first_dnd_field(fields, "PassiveInsight", "Passive Insight")
    combat["passive_investigation"] = _first_dnd_field(fields, "PassiveInvestigation", "Passive Investigation")

    resources = sheet["resources"]
    for coin in ("cp", "sp", "ep", "gp", "pp"):
        resources[coin] = _first_dnd_field(fields, coin.upper(), coin)
    equipment: list[dict[str, str]] = []
    for index in _dnd_numbered_indexes(fields, "EqName") + _dnd_numbered_indexes(fields, "Eq Name"):
        item = {
            "name": _first_dnd_field(fields, f"Eq Name{index}", f"EqName{index}", f"EquipmentName{index}"),
            "quantity": _first_dnd_field(fields, f"Eq Qty{index}", f"EqQty{index}", f"EquipmentQty{index}"),
            "weight": _first_dnd_field(fields, f"Eq Weight{index}", f"EqWeight{index}", f"EquipmentWeight{index}"),
        }
        if any(item.values()) and item not in equipment:
            equipment.append(item)
    resources["equipment"] = equipment or _first_dnd_field(fields, "Equipment", "EquipmentList")
    resources["weight_carried"] = _first_dnd_field(fields, "WeightCarried", "Weight Carried")
    resources["encumbered"] = _first_dnd_field(fields, "Encumbered")
    resources["push_drag_lift"] = _first_dnd_field(fields, "PushDragLift", "Push Drag Lift")

    features = sheet["features"]
    features["features_and_traits"] = _first_dnd_field(fields, "FeaturesTraits", "Features & Traits", "Features and Traits")
    features["proficiencies_and_training"] = _first_dnd_field(fields, "ProficienciesTraining", "Proficiencies & Training")
    features["senses"] = _first_dnd_field(fields, "Senses")

    personality = sheet["personality"]
    personality["traits"] = _first_dnd_field(fields, "PersonalityTraits", "Personality Traits")
    personality["ideals"] = _first_dnd_field(fields, "Ideals")
    personality["bonds"] = _first_dnd_field(fields, "Bonds")
    personality["flaws"] = _first_dnd_field(fields, "Flaws")
    personality["backstory"] = _first_dnd_field(fields, "Backstory", "Character Backstory")
    personality["appearance"] = _first_dnd_field(fields, "Appearance", "Character Appearance")
    personality["allies_organizations"] = _first_dnd_field(fields, "AlliesOrganizations", "Allies & Organizations")

    spellcasting = sheet["spellcasting"]
    spellcasting["class"] = _first_dnd_field(fields, "SpellcastingClass", "Spellcasting Class")
    spellcasting["ability"] = _first_dnd_field(fields, "SpellcastingAbility", "Spellcasting Ability")
    spellcasting["save_dc"] = _first_dnd_field(fields, "SpellSaveDC", "Spell Save DC", "spellSaveDC0")
    spellcasting["attack_bonus"] = _first_dnd_field(fields, "SpellAttackBonus", "Spell Attack Bonus", "spellAtkBonus0")

    attacks: list[dict[str, str]] = []
    for index in range(12):
        attack = {
            "name": _first_dnd_field(fields, f"AttackName{index}", f"WeaponName{index}", f"atkName{index}"),
            "hit": _first_dnd_field(fields, f"AttackBonus{index}", f"AttackHit{index}", f"WeaponHit{index}", f"atkBonus{index}"),
            "damage": _first_dnd_field(fields, f"AttackDamage{index}", f"DamageType{index}", f"WeaponDamage{index}", f"atkDamage{index}"),
            "notes": _first_dnd_field(fields, f"AttackNotes{index}", f"WeaponNotes{index}", f"atkNotes{index}"),
        }
        if any(attack.values()):
            attacks.append(attack)
    sheet["attacks"] = attacks

    spells: list[dict[str, object]] = []
    for index in _dnd_numbered_indexes(fields, "spellName"):
        spell = {
            "name": _first_dnd_field(fields, f"spellName{index}"),
            "level": _first_dnd_field(fields, f"spellLevel{index}", f"spellLevelSchool{index}"),
            "prepared": _truthy_dnd_field(_first_dnd_field(fields, f"spellPrepared{index}", f"spellPrep{index}")),
            "source": _first_dnd_field(fields, f"spellSource{index}"),
            "save_attack": _first_dnd_field(fields, f"spellSaveHit{index}", f"spellSaveAtk{index}", f"spellAttack{index}"),
            "casting_time": _first_dnd_field(fields, f"spellCastingTime{index}", f"spellCastTime{index}"),
            "range": _first_dnd_field(fields, f"spellRange{index}"),
            "components": _first_dnd_field(fields, f"spellComponents{index}"),
            "duration": _first_dnd_field(fields, f"spellDuration{index}"),
            "page": _first_dnd_field(fields, f"spellPage{index}"),
            "notes": _first_dnd_field(fields, f"spellNotes{index}", f"spellDescription{index}"),
        }
        if any(value for value in spell.values() if value is not False):
            spells.append(spell)
    spellcasting["spells"] = spells


def _parse_dnd_pdf_to_data(pdf_path: Path, original_name: str) -> dict[str, object]:
    try:
        reader = PdfReader(str(pdf_path))
    except Exception as exc:
        raise ValueError("PDF konnte nicht gelesen werden.") from exc

    fields_payload: dict[str, object] = {}
    try:
        fields = reader.get_fields() or {}
    except Exception:
        fields = {}
    for field_name, field in fields.items():
        raw_value = field.get("/V", "") if hasattr(field, "get") else ""
        fields_payload[str(field_name)] = "" if raw_value is None else str(raw_value)

    pages: list[dict[str, object]] = []
    all_lines: list[str] = []
    for page_index, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        all_lines.extend(lines)
        pages.append({"page": page_index, "text": text, "lines": lines})

    key_value_lines: dict[str, str] = {}
    for line in all_lines:
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        normalized_key = key.strip()
        normalized_value = value.strip()
        if normalized_key and normalized_value:
            key_value_lines[normalized_key] = normalized_value

    playable_sheet = _empty_dnd_character_sheet()
    _populate_dnd_sheet_from_fields(playable_sheet, fields_payload)
    return {
        "ruleset": "dnd",
        "schema_version": 2,
        "source": {
            "type": "pdf",
            "original_name": original_name,
            "parsed_at": datetime.now(timezone.utc).isoformat(),
            "page_count": len(reader.pages),
            "form_field_count": len(fields_payload),
            "text_line_count": len(all_lines),
            "parse_note": "Formularfelder werden in spielbare DnD-Felder gemappt. Wenn die PDF keine Formularfelder enthaelt, bleiben Spielwerte leer und der extrahierte Text steht unter raw_text/pages.",
        },
        **playable_sheet,
        "pdf_fields": fields_payload,
        "key_value_lines": key_value_lines,
        "pages": pages,
        "raw_text": "\n\n".join(str(page["text"]) for page in pages),
    }


def _decode_character_sheet_data(raw_value: str) -> dict[str, object]:
    try:
        parsed = json.loads(raw_value or "{}")
    except json.JSONDecodeError:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def list_character_sheets(project_id: str = "", acting_user: dict[str, str] | None = None) -> dict[str, object]:
    if not acting_user:
        raise ValueError("Benutzer fehlt.")
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _resolve_character_sheet_project_row(connection, acting_user, project_id)
        rows = connection.execute(
            """
            SELECT
                u.id AS user_id,
                u.username AS username,
                cs.character_name AS character_name,
                cs.volk AS volk,
                cs.level AS level,
                cs.pdf_file_name AS pdf_file_name,
                cs.pdf_original_name AS pdf_original_name,
                cs.created_at AS created_at,
                cs.updated_at AS updated_at
            FROM project_players pp
            JOIN users u ON u.id = pp.user_id
            LEFT JOIN character_sheets cs
              ON cs.project_id = pp.project_id
             AND cs.user_id = pp.user_id
            WHERE pp.project_id = ?
              AND u.role = 'spieler'
            ORDER BY u.username COLLATE NOCASE ASC
            """,
            (str(project_row["id"]),),
        ).fetchall()

    acting_user_id = str(acting_user.get("id") or "").strip()
    role = str(acting_user.get("role") or "").strip().lower()
    visible_rows = rows if role in {"admin", "spielleiter"} else [row for row in rows if str(row["user_id"]) == acting_user_id]
    default_user_id = acting_user_id if role == "spieler" else (str(visible_rows[0]["user_id"]) if visible_rows else "")
    return {
        "project": {
            "id": str(project_row["id"]),
            "name": str(project_row["name"]),
            "ruleset": str(project_row["ruleset"] or DEFAULT_PROJECT_RULESET),
        },
        "viewer": {
            "id": acting_user_id,
            "role": role,
            "can_manage_all": role in {"admin", "spielleiter"},
        },
        "default_user_id": default_user_id,
        "sheets": [
            {
                "user_id": str(row["user_id"]),
                "username": str(row["username"]),
                "character_name": str(row["character_name"] or ""),
                "volk": str(row["volk"] or ""),
                "level": int(row["level"] or 1),
                "has_pdf": bool(row["pdf_file_name"]),
                "pdf_original_name": str(row["pdf_original_name"] or ""),
                "created_at": str(row["created_at"] or ""),
                "updated_at": str(row["updated_at"] or ""),
                "has_sheet": bool(row["updated_at"] or row["pdf_file_name"]),
                "is_me": str(row["user_id"]) == acting_user_id,
            }
            for row in visible_rows
        ],
    }


def get_character_sheet(
    target_user_id: str,
    project_id: str = "",
    acting_user: dict[str, str] | None = None,
) -> dict[str, object]:
    if not acting_user:
        raise ValueError("Benutzer fehlt.")
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _resolve_character_sheet_project_row(connection, acting_user, project_id)
        user_row = _resolve_character_sheet_user_row(connection, str(project_row["id"]), target_user_id, acting_user)
        sheet_row = connection.execute(
            """
            SELECT project_id, user_id, character_name, volk, level, data_json, pdf_file_name, pdf_original_name, created_at, updated_at
            FROM character_sheets
            WHERE project_id = ? AND user_id = ?
            """,
            (str(project_row["id"]), str(user_row["id"])),
        ).fetchone()

    data = _decode_character_sheet_data(str(sheet_row["data_json"])) if sheet_row else {}
    character_name = str(sheet_row["character_name"] or "") if sheet_row else ""
    volk = str(sheet_row["volk"] or "") if sheet_row else ""
    level = int(sheet_row["level"] or 1) if sheet_row else 1
    return {
        "project": {
            "id": str(project_row["id"]),
            "name": str(project_row["name"]),
            "ruleset": str(project_row["ruleset"] or DEFAULT_PROJECT_RULESET),
        },
        "sheet": {
            "user_id": str(user_row["id"]),
            "username": str(user_row["username"]),
            "character_name": character_name,
            "volk": volk,
            "level": level,
            "has_pdf": bool(sheet_row["pdf_file_name"]) if sheet_row else False,
            "pdf_original_name": str(sheet_row["pdf_original_name"] or "") if sheet_row else "",
            "pdf_url": f"/api/character-sheets/{user_row['id']}/pdf?project_id={project_row['id']}" if sheet_row and sheet_row["pdf_file_name"] else "",
            "created_at": str(sheet_row["created_at"] or "") if sheet_row else "",
            "updated_at": str(sheet_row["updated_at"] or "") if sheet_row else "",
            "has_sheet": sheet_row is not None,
            "data": data,
        },
    }


def save_character_sheet(
    target_user_id: str,
    data: dict[str, object],
    project_id: str = "",
    acting_user: dict[str, str] | None = None,
) -> dict[str, object]:
    if not acting_user:
        raise ValueError("Benutzer fehlt.")
    normalized_data = _sanitize_character_sheet_data(data)
    character_name, volk, level = _character_sheet_summary_fields(normalized_data)
    timestamp = datetime.now(timezone.utc).isoformat()

    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _resolve_character_sheet_project_row(connection, acting_user, project_id)
        user_row = _resolve_character_sheet_user_row(connection, str(project_row["id"]), target_user_id, acting_user)
        existing_row = connection.execute(
            """
            SELECT created_at
            FROM character_sheets
            WHERE project_id = ? AND user_id = ?
            """,
            (str(project_row["id"]), str(user_row["id"])),
        ).fetchone()
        created_at = str(existing_row["created_at"]) if existing_row else timestamp
        connection.execute(
            """
            INSERT INTO character_sheets (project_id, user_id, character_name, volk, level, data_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(project_id, user_id) DO UPDATE SET
                character_name = excluded.character_name,
                volk = excluded.volk,
                level = excluded.level,
                data_json = excluded.data_json,
                updated_at = excluded.updated_at
            """,
            (
                str(project_row["id"]),
                str(user_row["id"]),
                character_name,
                volk,
                level,
                json.dumps(normalized_data, ensure_ascii=True),
                created_at,
                timestamp,
            ),
        )
        connection.commit()

    return get_character_sheet(str(user_row["id"]), project_id=str(project_row["id"]), acting_user=acting_user)


async def save_character_sheet_pdf(
    target_user_id: str,
    pdf_upload: UploadFile,
    project_id: str = "",
    acting_user: dict[str, str] | None = None,
) -> dict[str, object]:
    if not acting_user:
        raise ValueError("Benutzer fehlt.")
    if not pdf_upload or not pdf_upload.filename:
        raise ValueError("PDF-Datei fehlt.")
    original_name = _sanitize_pdf_filename(pdf_upload.filename)
    timestamp = datetime.now(timezone.utc).isoformat()

    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _resolve_character_sheet_project_row(connection, acting_user, project_id)
        if not _project_is_dnd(project_row):
            raise ValueError("PDF-Import ist nur fuer DnD-Projekte verfuegbar.")
        user_row = _resolve_character_sheet_user_row(connection, str(project_row["id"]), target_user_id, acting_user)
        existing_row = connection.execute(
            """
            SELECT created_at, pdf_file_name
            FROM character_sheets
            WHERE project_id = ? AND user_id = ?
            """,
            (str(project_row["id"]), str(user_row["id"])),
        ).fetchone()
        created_at = str(existing_row["created_at"]) if existing_row else timestamp
        old_pdf_file_name = str(existing_row["pdf_file_name"] or "") if existing_row else ""
        pdf_file_name = f"{project_row['id']}-{user_row['id']}-{uuid4().hex}.pdf"
        target_path = CHARACTER_SHEET_PDF_DIR / pdf_file_name
        with target_path.open("wb") as handle:
            shutil.copyfileobj(pdf_upload.file, handle)
        parsed_data = _parse_dnd_pdf_to_data(target_path, original_name)
        parsed_character_name, parsed_species, parsed_level = _character_sheet_summary_fields(parsed_data)
        fallback_character_name = Path(original_name).stem.replace("_", " ").replace("-", " ").strip()
        stored_character_name = parsed_character_name or fallback_character_name
        connection.execute(
            """
            INSERT INTO character_sheets (
                project_id, user_id, character_name, volk, level, data_json, pdf_file_name, pdf_original_name, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(project_id, user_id) DO UPDATE SET
                character_name = excluded.character_name,
                volk = excluded.volk,
                level = excluded.level,
                data_json = excluded.data_json,
                pdf_file_name = excluded.pdf_file_name,
                pdf_original_name = excluded.pdf_original_name,
                updated_at = excluded.updated_at
            """,
            (
                str(project_row["id"]),
                str(user_row["id"]),
                stored_character_name,
                parsed_species,
                parsed_level,
                json.dumps(parsed_data, ensure_ascii=True),
                pdf_file_name,
                original_name,
                created_at,
                timestamp,
            ),
        )
        connection.commit()

    if old_pdf_file_name and old_pdf_file_name != pdf_file_name:
        old_path = CHARACTER_SHEET_PDF_DIR / old_pdf_file_name
        if old_path.exists() and old_path.is_file():
            old_path.unlink()

    return get_character_sheet(str(user_row["id"]), project_id=str(project_row["id"]), acting_user=acting_user)


def get_character_sheet_pdf_path(
    target_user_id: str,
    project_id: str = "",
    acting_user: dict[str, str] | None = None,
) -> tuple[Path, str]:
    if not acting_user:
        raise ValueError("Benutzer fehlt.")
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _resolve_character_sheet_project_row(connection, acting_user, project_id)
        if not _project_is_dnd(project_row):
            raise ValueError("PDF-Anzeige ist nur fuer DnD-Projekte verfuegbar.")
        user_row = _resolve_character_sheet_user_row(connection, str(project_row["id"]), target_user_id, acting_user)
        row = connection.execute(
            """
            SELECT pdf_file_name, pdf_original_name
            FROM character_sheets
            WHERE project_id = ? AND user_id = ?
            """,
            (str(project_row["id"]), str(user_row["id"])),
        ).fetchone()
    if not row or not str(row["pdf_file_name"] or ""):
        raise ValueError("PDF-Charakterbogen nicht gefunden.")
    pdf_path = CHARACTER_SHEET_PDF_DIR / str(row["pdf_file_name"])
    if not pdf_path.exists() or not pdf_path.is_file():
        raise ValueError("PDF-Charakterbogen nicht gefunden.")
    return pdf_path, str(row["pdf_original_name"] or "charakterbogen.pdf")


def delete_character_sheet_pdf(
    target_user_id: str,
    project_id: str = "",
    acting_user: dict[str, str] | None = None,
) -> dict[str, object]:
    if not acting_user:
        raise ValueError("Benutzer fehlt.")
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_row = _resolve_character_sheet_project_row(connection, acting_user, project_id)
        if not _project_is_dnd(project_row):
            raise ValueError("PDF-Loeschen ist nur fuer DnD-Projekte verfuegbar.")
        user_row = _resolve_character_sheet_user_row(connection, str(project_row["id"]), target_user_id, acting_user)
        row = connection.execute(
            """
            SELECT pdf_file_name
            FROM character_sheets
            WHERE project_id = ? AND user_id = ?
            """,
            (str(project_row["id"]), str(user_row["id"])),
        ).fetchone()
        if not row or not str(row["pdf_file_name"] or ""):
            raise ValueError("PDF-Charakterbogen nicht gefunden.")
        pdf_file_name = str(row["pdf_file_name"])
        timestamp = datetime.now(timezone.utc).isoformat()
        connection.execute(
            """
            UPDATE character_sheets
            SET pdf_file_name = '', pdf_original_name = '', updated_at = ?
            WHERE project_id = ? AND user_id = ?
            """,
            (timestamp, str(project_row["id"]), str(user_row["id"])),
        )
        connection.commit()

    pdf_path = CHARACTER_SHEET_PDF_DIR / pdf_file_name
    if pdf_path.exists() and pdf_path.is_file():
        pdf_path.unlink()
    return {"deleted": True, "project_id": str(project_row["id"]), "user_id": str(user_row["id"])}


def _default_music_state() -> dict[str, str | float | bool]:
    return {
        "track_id": "",
        "file_name": "",
        "title": "",
        "audio_url": "",
        "requested_by": "",
        "updated_at": "",
        "is_playing": False,
        "position_seconds": 0.0,
        "started_at": "",
    }


def _compute_music_state_position(state: dict[str, object] | None) -> float:
    if not state:
        return 0.0
    base_position = max(float(state.get("position_seconds") or 0.0), 0.0)
    if not bool(state.get("is_playing")):
        return base_position
    started_at_raw = str(state.get("started_at") or "").strip()
    if not started_at_raw:
        return base_position
    try:
        started_at = datetime.fromisoformat(started_at_raw)
    except ValueError:
        return base_position
    if started_at.tzinfo is None:
        started_at = started_at.replace(tzinfo=timezone.utc)
    return max(base_position + max((datetime.now(timezone.utc) - started_at).total_seconds(), 0.0), 0.0)


def get_music_state() -> dict[str, str | float | bool]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
    raw_value = get_setting(_project_setting_key(MUSIC_STATE_SETTING_KEY, project_id), "")
    if not raw_value:
        return _default_music_state()
    try:
        data = json.loads(raw_value)
    except json.JSONDecodeError:
        return _default_music_state()
    state = _default_music_state()
    if isinstance(data, dict):
        state["track_id"] = str(data.get("track_id") or "").strip()
        state["file_name"] = str(data.get("file_name") or "").strip()
        state["title"] = str(data.get("title") or "").strip()
        state["requested_by"] = str(data.get("requested_by") or "").strip()
        state["updated_at"] = str(data.get("updated_at") or "").strip()
        state["is_playing"] = bool(data.get("is_playing"))
        state["position_seconds"] = max(float(data.get("position_seconds") or 0.0), 0.0)
        state["started_at"] = str(data.get("started_at") or "").strip()
        if state["file_name"]:
            state["audio_url"] = f"/api/music-file/{state['file_name']}?ts={state['updated_at']}"
        else:
            state["audio_url"] = ""
    return state


def set_music_state(
    *,
    track_id: str = "",
    file_name: str,
    title: str,
    requested_by: str = "",
    is_playing: bool = False,
    position_seconds: float = 0.0,
    started_at: str = "",
) -> dict[str, str | float | bool]:
    init_storage()
    timestamp = datetime.now(timezone.utc).isoformat()
    payload = {
        "track_id": str(track_id or "").strip(),
        "file_name": str(file_name or "").strip(),
        "title": str(title or "").strip(),
        "requested_by": str(requested_by or "").strip(),
        "updated_at": timestamp,
        "is_playing": bool(is_playing),
        "position_seconds": max(float(position_seconds or 0.0), 0.0),
        "started_at": str(started_at or "").strip(),
    }
    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
        _upsert_setting(connection, _project_setting_key(MUSIC_STATE_SETTING_KEY, project_id), json.dumps(payload, ensure_ascii=True))
        connection.commit()
    payload["audio_url"] = f"/api/music-file/{payload['file_name']}?ts={timestamp}" if payload["file_name"] else ""
    return payload


def clear_music_state(requested_by: str = "") -> dict[str, str | float | bool]:
    return set_music_state(track_id="", file_name="", title="", requested_by=requested_by)


def _default_map_sound_cue() -> dict[str, str | float | bool]:
    return {
        "cue_id": "",
        "pin_id": "",
        "file_name": "",
        "title": "",
        "audio_url": "",
        "requested_by": "",
        "updated_at": "",
        "resume_music": False,
        "resume_track_id": "",
        "resume_file_name": "",
        "resume_title": "",
        "resume_position_seconds": 0.0,
    }


def get_map_sound_cue() -> dict[str, str | float | bool]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
    raw_value = get_setting(_project_setting_key(MAP_SOUND_CUE_SETTING_KEY, project_id), "")
    if not raw_value:
        return _default_map_sound_cue()
    try:
        data = json.loads(raw_value)
    except json.JSONDecodeError:
        return _default_map_sound_cue()
    cue = _default_map_sound_cue()
    if isinstance(data, dict):
        cue["cue_id"] = str(data.get("cue_id") or "").strip()
        cue["pin_id"] = str(data.get("pin_id") or "").strip()
        cue["file_name"] = str(data.get("file_name") or "").strip()
        cue["title"] = str(data.get("title") or "").strip()
        cue["requested_by"] = str(data.get("requested_by") or "").strip()
        cue["updated_at"] = str(data.get("updated_at") or "").strip()
        cue["resume_music"] = bool(data.get("resume_music"))
        cue["resume_track_id"] = str(data.get("resume_track_id") or "").strip()
        cue["resume_file_name"] = str(data.get("resume_file_name") or "").strip()
        cue["resume_title"] = str(data.get("resume_title") or "").strip()
        cue["resume_position_seconds"] = max(float(data.get("resume_position_seconds") or 0.0), 0.0)
        if cue["file_name"]:
            cue["audio_url"] = f"/api/map-pin-sound/{cue['file_name']}?ts={cue['updated_at']}"
    return cue


def _set_map_sound_cue(
    *,
    cue_id: str,
    pin_id: str,
    file_name: str,
    title: str,
    requested_by: str = "",
    resume_music: bool = False,
    resume_track_id: str = "",
    resume_file_name: str = "",
    resume_title: str = "",
    resume_position_seconds: float = 0.0,
) -> dict[str, str | float | bool]:
    init_storage()
    timestamp = datetime.now(timezone.utc).isoformat()
    payload = {
        "cue_id": str(cue_id or "").strip(),
        "pin_id": str(pin_id or "").strip(),
        "file_name": str(file_name or "").strip(),
        "title": str(title or "").strip(),
        "requested_by": str(requested_by or "").strip(),
        "updated_at": timestamp,
        "resume_music": bool(resume_music),
        "resume_track_id": str(resume_track_id or "").strip(),
        "resume_file_name": str(resume_file_name or "").strip(),
        "resume_title": str(resume_title or "").strip(),
        "resume_position_seconds": max(float(resume_position_seconds or 0.0), 0.0),
    }
    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
        _upsert_setting(connection, _project_setting_key(MAP_SOUND_CUE_SETTING_KEY, project_id), json.dumps(payload, ensure_ascii=True))
        connection.commit()
    payload["audio_url"] = f"/api/map-pin-sound/{payload['file_name']}?ts={timestamp}" if payload["file_name"] else ""
    return payload


def clear_map_sound_cue() -> dict[str, str | float | bool]:
    return _set_map_sound_cue(cue_id="", pin_id="", file_name="", title="")


def trigger_map_sound_cue(pin_id: str, requested_by: str = "") -> dict[str, object]:
    init_storage()
    normalized_pin_id = str(pin_id or "").strip()
    if not normalized_pin_id:
        raise ValueError("Sound-Token fehlt.")
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            """
            SELECT id, name, pin_type, sound_name, sound_title
            FROM map_pins
            WHERE id = ?
            """,
            (normalized_pin_id,),
        ).fetchone()
    if not row:
        raise ValueError("Sound-Token nicht gefunden.")
    if (row["pin_type"] or "pin") != "sound_token":
        raise ValueError("Marker ist kein Sound-Token.")
    sound_name = str(row["sound_name"] or "").strip()
    if not sound_name:
        raise ValueError("Sound-Token hat keine Audiodatei.")

    music_state = get_music_state()
    resume_music = bool(music_state.get("file_name")) and bool(music_state.get("is_playing"))
    resume_position_seconds = _compute_music_state_position(music_state) if resume_music else 0.0
    if resume_music:
        set_music_state(
            track_id=str(music_state.get("track_id") or ""),
            file_name=str(music_state.get("file_name") or ""),
            title=str(music_state.get("title") or ""),
            requested_by=requested_by or str(music_state.get("requested_by") or ""),
            is_playing=False,
            position_seconds=resume_position_seconds,
            started_at="",
        )
    cue = _set_map_sound_cue(
        cue_id=uuid4().hex,
        pin_id=normalized_pin_id,
        file_name=sound_name,
        title=str(row["sound_title"] or row["name"] or "").strip(),
        requested_by=requested_by,
        resume_music=resume_music,
        resume_track_id=str(music_state.get("track_id") or "") if resume_music else "",
        resume_file_name=str(music_state.get("file_name") or "") if resume_music else "",
        resume_title=str(music_state.get("title") or "") if resume_music else "",
        resume_position_seconds=resume_position_seconds,
    )
    return {"cue": cue, "music_state": get_music_state()}


def complete_map_sound_cue(cue_id: str, requested_by: str = "") -> dict[str, object]:
    current_cue = get_map_sound_cue()
    normalized_cue_id = str(cue_id or "").strip()
    if not normalized_cue_id or str(current_cue.get("cue_id") or "") != normalized_cue_id:
        return {"cue": current_cue, "music_state": get_music_state()}
    if bool(current_cue.get("resume_music")) and str(current_cue.get("resume_file_name") or ""):
        set_music_state(
            track_id=str(current_cue.get("resume_track_id") or ""),
            file_name=str(current_cue.get("resume_file_name") or ""),
            title=str(current_cue.get("resume_title") or ""),
            requested_by=requested_by or str(current_cue.get("requested_by") or ""),
            is_playing=True,
            position_seconds=max(float(current_cue.get("resume_position_seconds") or 0.0), 0.0),
            started_at=datetime.now(timezone.utc).isoformat(),
        )
    clear_map_sound_cue()
    return {"cue": get_map_sound_cue(), "music_state": get_music_state()}


def save_music_track(upload: UploadFile, requested_by: str = "") -> dict[str, str | float | bool]:
    init_storage()
    if not upload or not upload.filename:
        raise ValueError("Audiodatei fehlt.")
    original_name = _sanitize_filename(upload.filename or "track.bin")
    extension = Path(original_name).suffix.lower() or ".bin"
    if extension not in ALLOWED_MUSIC_EXTENSIONS:
        raise ValueError("Erlaubt sind MP3, OGG, WAV, M4A, AAC, MP4 oder WEBM.")
    stored_name = f"{uuid4().hex}{extension}"
    target_path = MUSIC_DIR / stored_name
    track_id = uuid4().hex

    with target_path.open("wb") as handle:
        shutil.copyfileobj(upload.file, handle)

    size_bytes = target_path.stat().st_size
    content_type = str(upload.content_type or "").strip()
    created_at = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
        connection.execute(
            """
            INSERT INTO music_tracks (
                id,
                project_id,
                file_name,
                title,
                extension,
                content_type,
                size_bytes,
                uploaded_by,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                track_id,
                project_id,
                stored_name,
                Path(original_name).stem,
                extension,
                content_type,
                size_bytes,
                requested_by.strip(),
                created_at,
            ),
        )
        connection.commit()

    return set_music_state(
        track_id=track_id,
        file_name=stored_name,
        title=Path(original_name).stem,
        requested_by=requested_by,
        is_playing=False,
        position_seconds=0.0,
        started_at="",
    )


def update_music_playback(
    *,
    requested_by: str = "",
    is_playing: bool | None = None,
    position_seconds: float | None = None,
) -> dict[str, str | float | bool]:
    current_state = get_music_state()
    file_name = str(current_state.get("file_name") or "")
    if not file_name:
        return current_state
    next_is_playing = bool(current_state.get("is_playing")) if is_playing is None else bool(is_playing)
    next_position = max(float(current_state.get("position_seconds") or 0.0), 0.0)
    if position_seconds is not None:
        next_position = max(float(position_seconds), 0.0)
    next_started_at = str(current_state.get("started_at") or "")
    if next_is_playing:
        next_started_at = datetime.now(timezone.utc).isoformat()
    else:
        next_started_at = ""
    return set_music_state(
        track_id=str(current_state.get("track_id") or ""),
        file_name=file_name,
        title=str(current_state.get("title") or ""),
        requested_by=requested_by or str(current_state.get("requested_by") or ""),
        is_playing=next_is_playing,
        position_seconds=next_position,
        started_at=next_started_at,
    )


def get_music_file_path(file_name: str) -> Path | None:
    init_storage()
    normalized = Path(file_name or "").name
    if not normalized:
        return None
    music_path = MUSIC_DIR / normalized
    if not music_path.exists() or not music_path.is_file():
        return None
    return music_path


def list_music_tracks() -> list[dict[str, str | int]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        rows = connection.execute(
            """
            SELECT id, file_name, title, extension, content_type, size_bytes, uploaded_by, created_at
            FROM music_tracks
            WHERE project_id = ?
            ORDER BY datetime(created_at) DESC, created_at DESC
            """
            ,
            (project_id,),
        ).fetchall()
    return [
        {
            "id": row["id"],
            "file_name": row["file_name"],
            "title": row["title"],
            "extension": row["extension"],
            "content_type": row["content_type"],
            "size_bytes": row["size_bytes"],
            "uploaded_by": row["uploaded_by"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


def select_music_track(track_id: str, requested_by: str = "") -> dict[str, str | float | bool]:
    init_storage()
    normalized_track_id = str(track_id or "").strip()
    if not normalized_track_id:
        raise ValueError("Track fehlt.")
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        row = connection.execute(
            """
            SELECT id, file_name, title
            FROM music_tracks
            WHERE id = ?
              AND project_id = ?
            """,
            (normalized_track_id, project_id),
        ).fetchone()
    if not row:
        raise ValueError("Track nicht gefunden.")
    current_state = get_music_state()
    next_position = 0.0
    next_is_playing = False
    if str(current_state.get("track_id") or "") == normalized_track_id:
        next_position = float(current_state.get("position_seconds") or 0.0)
        next_is_playing = bool(current_state.get("is_playing"))
    return set_music_state(
        track_id=row["id"],
        file_name=row["file_name"],
        title=row["title"],
        requested_by=requested_by,
        is_playing=next_is_playing,
        position_seconds=next_position,
        started_at=datetime.now(timezone.utc).isoformat() if next_is_playing else "",
    )


def _scoped_map_setting_key(base_key: str, map_id: str) -> str:
    return f"{base_key}:{map_id}"


def _get_active_map_id(connection: sqlite3.Connection) -> str:
    project_id = _get_active_project_id(connection)
    row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (_project_setting_key(ACTIVE_MAP_ID_SETTING_KEY, project_id),),
    ).fetchone()
    return row[0] if row else ""


def _set_active_map_id(connection: sqlite3.Connection, map_id: str) -> None:
    project_id = _get_active_project_id(connection)
    _upsert_setting(connection, _project_setting_key(ACTIVE_MAP_ID_SETTING_KEY, project_id), map_id)


def _get_active_battlemap_id(connection: sqlite3.Connection) -> str:
    project_id = _get_active_project_id(connection)
    row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (_project_setting_key(ACTIVE_BATTLEMAP_ID_SETTING_KEY, project_id),),
    ).fetchone()
    return row[0] if row else ""


def _set_active_battlemap_id(connection: sqlite3.Connection, battlemap_id: str) -> None:
    project_id = _get_active_project_id(connection)
    _upsert_setting(connection, _project_setting_key(ACTIVE_BATTLEMAP_ID_SETTING_KEY, project_id), battlemap_id)


def _get_active_surface(connection: sqlite3.Connection) -> dict[str, str]:
    project_id = _get_active_project_id(connection)
    kind_row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (_project_setting_key(ACTIVE_SURFACE_KIND_SETTING_KEY, project_id),),
    ).fetchone()
    id_row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (_project_setting_key(ACTIVE_SURFACE_ID_SETTING_KEY, project_id),),
    ).fetchone()
    kind = str(kind_row[0] if kind_row else "").strip().lower()
    target_id = str(id_row[0] if id_row else "").strip()
    if kind not in {"map", "battlemap"} or not target_id:
        return {"kind": "map", "id": _get_active_map_id(connection)}
    return {"kind": kind, "id": target_id}


def _set_active_surface(connection: sqlite3.Connection, kind: str, target_id: str) -> None:
    normalized_kind = str(kind or "").strip().lower()
    normalized_id = str(target_id or "").strip()
    if normalized_kind not in {"map", "battlemap"} or not normalized_id:
        return
    project_id = _get_active_project_id(connection)
    _upsert_setting(connection, _project_setting_key(ACTIVE_SURFACE_KIND_SETTING_KEY, project_id), normalized_kind)
    _upsert_setting(connection, _project_setting_key(ACTIVE_SURFACE_ID_SETTING_KEY, project_id), normalized_id)


def _map_row_to_dict(row: sqlite3.Row | tuple | None) -> dict[str, str] | None:
    if not row:
        return None
    if isinstance(row, sqlite3.Row):
        return {
            "id": row["id"],
            "name": row["name"],
            "image_name": row["image_name"] or "",
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
    return {
        "id": row[0],
        "name": row[1],
        "image_name": row[2] or "",
        "created_at": row[3],
        "updated_at": row[4],
    }


def _normalize_map_background_color(value: str | None) -> str:
    candidate = str(value or "").strip()
    if not candidate:
        return "#223044"
    if re.fullmatch(r"#[0-9a-fA-F]{6}", candidate):
        return candidate.lower()
    return "#223044"


def _normalize_map_canvas_size(value: int | str | None) -> int:
    try:
        numeric = int(value if value is not None else 4096)
    except (TypeError, ValueError):
        numeric = 4096
    return min(max(numeric, 2048), 8192)


def _map_layer_row_to_dict(row: sqlite3.Row | tuple | None) -> dict[str, object] | None:
    if not row:
        return None
    if isinstance(row, sqlite3.Row):
        return {
            "id": row["id"],
            "map_id": row["map_id"],
            "name": row["name"],
            "image_name": row["image_name"] or "",
            "background_color": _normalize_map_background_color(row["background_color"] if "background_color" in row.keys() else "#223044"),
            "canvas_width": _normalize_map_canvas_size(row["canvas_width"] if "canvas_width" in row.keys() else 4096),
            "canvas_height": _normalize_map_canvas_size(row["canvas_height"] if "canvas_height" in row.keys() else 4096),
            "sort_order": int(row["sort_order"] or 0),
            "is_default": bool(row["is_default"]),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
    return {
        "id": row[0],
        "map_id": row[1],
        "name": row[2],
        "image_name": row[3] or "",
        "background_color": _normalize_map_background_color(row[4] if len(row) > 4 else "#223044"),
        "canvas_width": _normalize_map_canvas_size(row[5] if len(row) > 5 else 4096),
        "canvas_height": _normalize_map_canvas_size(row[6] if len(row) > 6 else 4096),
        "sort_order": int(row[7] or 0) if len(row) > 7 else 0,
        "is_default": bool(row[8]) if len(row) > 8 else False,
        "created_at": row[9] if len(row) > 9 else "",
        "updated_at": row[10] if len(row) > 10 else "",
    }


def _normalize_visibility_layer(value: str | None) -> str:
    normalized = str(value or "").strip().lower()
    return GM_LAYER if normalized == GM_LAYER else PUBLIC_LAYER


def _normalize_vision_radius(value: float | int | str | None) -> float:
    try:
        numeric = float(value if value is not None else DEFAULT_MAP_TOKEN_VISION_RADIUS)
    except (TypeError, ValueError):
        numeric = DEFAULT_MAP_TOKEN_VISION_RADIUS
    return min(max(numeric, 0.02), 1.0)


def _normalize_fog_areas(value: object) -> list[dict[str, float]]:
    if not isinstance(value, list):
        return []
    normalized: list[dict[str, float]] = []
    for item in value:
        if not isinstance(item, dict):
            continue
        try:
            x = min(max(float(item.get("x", 0.0)), 0.0), 1.0)
            y = min(max(float(item.get("y", 0.0)), 0.0), 1.0)
            radius = min(max(float(item.get("radius", 0.0)), 0.0), 1.0)
        except (TypeError, ValueError):
            continue
        normalized.append({"x": x, "y": y, "radius": radius})
    return normalized


def _battlemap_token_payload(
    token_id: str,
    name: str,
    token_type: str,
    x: int,
    y: int,
    color: str,
    initiative: int,
    move_range: int,
    attack_range: int,
    vision_range: int = DEFAULT_BATTLEMAP_TOKEN_VISION_RANGE,
    steps_used: int = 0,
    action_used: bool = False,
    image_name: str = "",
    assigned_user_id: str = "",
    assigned_username: str = "",
    visibility_layer: str = PUBLIC_LAYER,
) -> dict[str, object]:
    return {
        "id": token_id,
        "name": name,
        "type": token_type,
        "x": x,
        "y": y,
        "color": color,
        "initiative": initiative,
        "move_range": move_range,
        "attack_range": attack_range,
        "vision_range": _normalize_battlemap_size(vision_range, 1, 24),
        "steps_used": steps_used,
        "action_used": action_used,
        "image_name": image_name,
        "assigned_user_id": str(assigned_user_id or "").strip(),
        "assigned_username": str(assigned_username or "").strip(),
        "visibility_layer": _normalize_visibility_layer(visibility_layer),
    }


def _default_battlemap_tokens() -> list[dict[str, object]]:
    return [
        _battlemap_token_payload("player-1", "Held 1", "player", 1, 5, "#58c4ff", 15, 4, 1),
        _battlemap_token_payload("player-2", "Held 2", "player", 2, 5, "#7ddc78", 13, 4, 2),
        _battlemap_token_payload("enemy-1", "Gegner 1", "enemy", 8, 2, "#ff6b6b", 12, 3, 1),
        _battlemap_token_payload("enemy-2", "Gegner 2", "enemy", 9, 3, "#ff9b54", 10, 3, 1),
    ]


def _default_battlemap_obstacles() -> list[dict[str, int]]:
    return [
        {"x": 4, "y": 2},
        {"x": 4, "y": 3},
        {"x": 5, "y": 3},
        {"x": 6, "y": 4},
    ]


def _normalize_battlemap_size(value: int, minimum: int, maximum: int) -> int:
    return min(max(int(value), minimum), maximum)


def _normalize_battlemap_color(value: str | None, default: str = DEFAULT_BATTLEMAP_OBSTACLE_COLOR) -> str:
    normalized = str(value or "").strip()
    if re.fullmatch(r"#[0-9a-fA-F]{6}", normalized):
        return normalized.lower()
    return default


def _normalize_battlemap_obstacles(obstacles: list[dict[str, object]], grid_width: int, grid_height: int) -> list[dict[str, int]]:
    seen: set[tuple[int, int]] = set()
    normalized: list[dict[str, int]] = []
    for obstacle in obstacles:
        x = int(obstacle.get("x", -1))
        y = int(obstacle.get("y", -1))
        if x < 0 or y < 0 or x >= grid_width or y >= grid_height:
            continue
        key = (x, y)
        if key in seen:
            continue
        seen.add(key)
        normalized.append({"x": x, "y": y})
    normalized.sort(key=lambda item: (item["y"], item["x"]))
    return normalized


def _normalize_battlemap_tokens(tokens: list[dict[str, object]], grid_width: int, grid_height: int) -> list[dict[str, object]]:
    occupied: set[tuple[int, int]] = set()
    normalized: list[dict[str, object]] = []
    for token in tokens:
        token_id = str(token.get("id") or uuid4().hex).strip() or uuid4().hex
        name = str(token.get("name") or "Token").strip() or "Token"
        token_type = str(token.get("type") or "player").strip().lower()
        if token_type not in {"player", "enemy"}:
            token_type = "player"
        x = min(max(int(token.get("x", 0)), 0), grid_width - 1)
        y = min(max(int(token.get("y", 0)), 0), grid_height - 1)
        if (x, y) in occupied:
            continue
        occupied.add((x, y))
        normalized.append(
            {
                "id": token_id,
                "name": name,
                "type": token_type,
                "x": x,
                "y": y,
                "color": str(token.get("color") or ("#58c4ff" if token_type == "player" else "#ff6b6b")).strip() or "#58c4ff",
                "initiative": _normalize_battlemap_size(int(token.get("initiative", 10)), 0, 99),
                "move_range": _normalize_battlemap_size(int(token.get("move_range", 4)), 0, 20),
                "attack_range": _normalize_battlemap_size(int(token.get("attack_range", 1)), 0, 20),
                "vision_range": _normalize_battlemap_size(
                    int(token.get("vision_range", DEFAULT_BATTLEMAP_TOKEN_VISION_RANGE)),
                    1,
                    24,
                ),
                "steps_used": _normalize_battlemap_size(int(token.get("steps_used", 0)), 0, 20),
                "action_used": bool(token.get("action_used", False)),
                "image_name": str(token.get("image_name") or token.get("image_url") or "").strip(),
                "assigned_user_id": str(token.get("assigned_user_id") or "").strip(),
                "assigned_username": str(token.get("assigned_username") or "").strip(),
                "visibility_layer": _normalize_visibility_layer(str(token.get("visibility_layer") or "")),
            }
        )
    return normalized


def _sort_battlemap_tokens(tokens: list[dict[str, object]]) -> list[dict[str, object]]:
    return sorted(
        tokens,
        key=lambda item: (
            -int(item.get("initiative", 0)),
            0 if str(item.get("type") or "player") == "player" else 1,
            str(item.get("name") or ""),
            str(item.get("id") or ""),
        ),
    )


def _token_turn_complete(token: dict[str, object]) -> bool:
    return int(token.get("steps_used", 0)) >= int(token.get("move_range", 0)) and bool(token.get("action_used", False))


def _prepare_battlemap_turn_state(tokens: list[dict[str, object]], round_number: int) -> tuple[list[dict[str, object]], int]:
    sorted_tokens = _sort_battlemap_tokens(tokens)
    if sorted_tokens and all(_token_turn_complete(token) for token in sorted_tokens):
        next_round = max(int(round_number or 1), 1) + 1
        reset_tokens = []
        for token in sorted_tokens:
            next_token = dict(token)
            next_token["steps_used"] = 0
            next_token["action_used"] = False
            reset_tokens.append(next_token)
        return reset_tokens, next_round
    return sorted_tokens, max(int(round_number or 1), 1)


def _active_battlemap_token_id(tokens: list[dict[str, object]]) -> str:
    for token in _sort_battlemap_tokens(tokens):
        if not _token_turn_complete(token):
            return str(token.get("id") or "")
    return ""


def _battlemap_shortest_path_length(
    start_x: int,
    start_y: int,
    end_x: int,
    end_y: int,
    *,
    grid_width: int,
    grid_height: int,
    blocked: set[tuple[int, int]],
) -> int | None:
    if (start_x, start_y) == (end_x, end_y):
        return 0
    queue: list[tuple[int, int, int]] = [(start_x, start_y, 0)]
    visited = {(start_x, start_y)}
    while queue:
        x, y, distance = queue.pop(0)
        for next_x, next_y in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if next_x < 0 or next_y < 0 or next_x >= grid_width or next_y >= grid_height:
                continue
            if (next_x, next_y) in visited or (next_x, next_y) in blocked:
                continue
            if (next_x, next_y) == (end_x, end_y):
                return distance + 1
            visited.add((next_x, next_y))
            queue.append((next_x, next_y, distance + 1))
    return None


def _battlemap_row_to_dict(row: sqlite3.Row | tuple | None) -> dict[str, object] | None:
    if not row:
        return None
    if isinstance(row, sqlite3.Row):
        battlemap_id = row["id"]
        background_image_name = row["background_image_name"] or ""
        updated_at = row["updated_at"]
        payload = {
            "id": battlemap_id,
            "name": row["name"],
            "background_image_name": background_image_name,
            "grid_width": int(row["grid_width"]),
            "grid_height": int(row["grid_height"]),
            "cell_size": int(row["cell_size"]),
            "scale_percent": int(row["scale_percent"]),
            "obstacle_color": _normalize_battlemap_color(row["obstacle_color"]),
            "fog_enabled": bool(int(row["fog_enabled"] or 0)),
            "fog_walls": json.loads(row["fog_walls_json"] or "[]"),
            "fog_doors": json.loads(row["fog_doors_json"] or "[]"),
            "round_number": int(row["round_number"]),
            "obstacles": json.loads(row["obstacles_json"] or "[]"),
            "tokens": json.loads(row["tokens_json"] or "[]"),
            "created_at": row["created_at"],
            "updated_at": updated_at,
        }
    else:
        battlemap_id = row[0]
        background_image_name = row[2] or ""
        updated_at = row[15]
        payload = {
            "id": battlemap_id,
            "name": row[1],
            "background_image_name": background_image_name,
            "grid_width": int(row[3]),
            "grid_height": int(row[4]),
            "cell_size": int(row[5]),
            "scale_percent": int(row[6]),
            "obstacle_color": _normalize_battlemap_color(row[7]),
            "fog_enabled": bool(int(row[8] or 0)),
            "fog_walls": json.loads(row[9] or "[]"),
            "fog_doors": json.loads(row[10] or "[]"),
            "round_number": int(row[11]),
            "obstacles": json.loads(row[12] or "[]"),
            "tokens": json.loads(row[13] or "[]"),
            "created_at": row[14],
            "updated_at": row[15],
        }
    payload["background_image_url"] = (
        f"/api/battlemaps/{battlemap_id}/background?ts={updated_at}" if background_image_name else ""
    )
    payload["tokens"] = _sort_battlemap_tokens(payload["tokens"])
    for token in payload["tokens"]:
        token["image_url"] = (
            f"/api/battlemaps/tokens/{token['id']}/image?ts={payload['updated_at']}" if token.get("image_name") else ""
        )
    payload["active_token_id"] = _active_battlemap_token_id(payload["tokens"])
    return payload


def filter_battlemap_for_visibility(battlemap: dict[str, object] | None, *, include_gm_layer: bool) -> dict[str, object] | None:
    if not battlemap:
        return battlemap
    payload = dict(battlemap)
    tokens = [dict(token) for token in list(payload.get("tokens") or [])]
    if not include_gm_layer:
        tokens = [token for token in tokens if _normalize_visibility_layer(str(token.get("visibility_layer") or "")) == PUBLIC_LAYER]
    payload["tokens"] = tokens
    active_token_id = str(payload.get("active_token_id") or "")
    payload["active_token_id"] = active_token_id if any(str(token.get("id") or "") == active_token_id for token in tokens) else ""
    return payload


def _ensure_default_map(connection: sqlite3.Connection) -> str:
    connection.row_factory = sqlite3.Row
    project_id = _get_active_project_id(connection)
    existing_maps = connection.execute(
        "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE project_id = ? ORDER BY datetime(created_at) ASC, created_at ASC",
        (project_id,),
    ).fetchall()
    active_map_id = _get_active_map_id(connection)

    if existing_maps:
        first_map = _map_row_to_dict(existing_maps[0])
        chosen_map_id = active_map_id or (first_map["id"] if first_map else "")
        if chosen_map_id:
            _set_active_map_id(connection, chosen_map_id)
            connection.execute("UPDATE map_draw_strokes SET map_id = ? WHERE map_id = ''", (chosen_map_id,))
            connection.execute("UPDATE map_pings SET map_id = ? WHERE map_id = ''", (chosen_map_id,))
            connection.execute("UPDATE map_pins SET map_id = ? WHERE map_id = ''", (chosen_map_id,))
            connection.execute("UPDATE map_overlays SET map_id = ? WHERE map_id = ''", (chosen_map_id,))
            return chosen_map_id

    timestamp = datetime.now(timezone.utc).isoformat()
    legacy_image_name_row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (MAP_IMAGE_SETTING_KEY,),
    ).fetchone()
    legacy_image_updated_at_row = connection.execute(
        "SELECT value FROM app_settings WHERE key = ?",
        (MAP_IMAGE_UPDATED_AT_SETTING_KEY,),
    ).fetchone()
    legacy_image_name = legacy_image_name_row[0] if legacy_image_name_row else ""
    legacy_image_updated_at = legacy_image_updated_at_row[0] if legacy_image_updated_at_row else timestamp
    default_map_id = uuid4().hex
    connection.execute(
        """
        INSERT INTO maps (id, project_id, name, image_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (default_map_id, project_id, DEFAULT_MAP_NAME, legacy_image_name or None, legacy_image_updated_at, legacy_image_updated_at),
    )
    _set_active_map_id(connection, default_map_id)
    connection.execute("UPDATE map_draw_strokes SET map_id = ? WHERE map_id = ''", (default_map_id,))
    connection.execute("UPDATE map_pings SET map_id = ? WHERE map_id = ''", (default_map_id,))
    connection.execute("UPDATE map_pins SET map_id = ? WHERE map_id = ''", (default_map_id,))
    connection.execute("UPDATE map_overlays SET map_id = ? WHERE map_id = ''", (default_map_id,))
    return default_map_id


def _ensure_map_layers(connection: sqlite3.Connection) -> None:
    connection.row_factory = sqlite3.Row
    map_rows = connection.execute(
        "SELECT id, name, image_name, created_at, updated_at FROM maps ORDER BY datetime(created_at) ASC, created_at ASC"
    ).fetchall()
    for row in map_rows:
        map_item = _map_row_to_dict(row)
        if not map_item:
            continue
        existing_layers = connection.execute(
            """
            SELECT id, map_id, name, image_name, background_color, canvas_width, canvas_height, sort_order, is_default, created_at, updated_at
            FROM map_layers
            WHERE map_id = ?
            ORDER BY is_default DESC, sort_order ASC, datetime(created_at) ASC, created_at ASC
            """,
            (map_item["id"],),
        ).fetchall()
        if not existing_layers:
            layer_id = uuid4().hex
            image_name = map_item["image_name"] or ""
            stored_image_name = image_name or None
            if image_name:
                extension = Path(image_name).suffix.lower() or ".bin"
                stored_image_name = f"{map_item['id']}-{layer_id}{extension}"
                legacy_path = MAP_DIR / image_name
                target_path = MAP_LAYER_DIR / stored_image_name
                if legacy_path.exists() and legacy_path.is_file() and not target_path.exists():
                    shutil.move(str(legacy_path), str(target_path))
                elif not target_path.exists():
                    stored_image_name = image_name
            connection.execute(
                """
                INSERT INTO map_layers (id, map_id, name, image_name, background_color, canvas_width, canvas_height, sort_order, is_default, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    layer_id,
                    map_item["id"],
                    "Ebene 1",
                    stored_image_name,
                    "#223044",
                    4096,
                    4096,
                    0,
                    1,
                    map_item["created_at"],
                    map_item["updated_at"],
                ),
            )
            if stored_image_name != image_name:
                connection.execute(
                    "UPDATE maps SET image_name = ? WHERE id = ?",
                    (stored_image_name, map_item["id"]),
                )
            continue
        for layer_row in existing_layers:
            layer_item = _map_layer_row_to_dict(layer_row)
            if not layer_item or not layer_item["image_name"]:
                continue
            image_name = str(layer_item["image_name"])
            legacy_path = MAP_DIR / image_name
            target_path = MAP_LAYER_DIR / image_name
            if legacy_path.exists() and legacy_path.is_file() and not target_path.exists():
                shutil.move(str(legacy_path), str(target_path))
        if not any(bool(layer["is_default"]) for layer in existing_layers):
            default_layer = existing_layers[0]
            connection.execute("UPDATE map_layers SET is_default = 0 WHERE map_id = ?", (map_item["id"],))
            connection.execute("UPDATE map_layers SET is_default = 1 WHERE id = ?", (default_layer["id"],))


def _ensure_map_content_layers(connection: sqlite3.Connection) -> None:
    connection.row_factory = sqlite3.Row
    map_rows = connection.execute("SELECT id FROM maps").fetchall()
    for map_row in map_rows:
        map_id = map_row["id"]
        default_layer_id = _resolve_map_layer_id(connection, map_id, None)
        connection.execute(
            "UPDATE map_draw_strokes SET layer_id = ? WHERE map_id = ? AND layer_id = ''",
            (default_layer_id, map_id),
        )
        connection.execute(
            "UPDATE map_pings SET layer_id = ? WHERE map_id = ? AND layer_id = ''",
            (default_layer_id, map_id),
        )
        connection.execute(
            "UPDATE map_pins SET layer_id = ? WHERE map_id = ? AND layer_id = ''",
            (default_layer_id, map_id),
        )
        connection.execute(
            "UPDATE map_overlays SET layer_id = ? WHERE map_id = ? AND layer_id = ''",
            (default_layer_id, map_id),
        )


def _ensure_map_fog_settings(connection: sqlite3.Connection) -> None:
    connection.row_factory = sqlite3.Row
    rows = connection.execute(
        """
        SELECT id, map_id, created_at, updated_at
        FROM map_layers
        ORDER BY datetime(created_at) ASC, created_at ASC
        """
    ).fetchall()
    for row in rows:
        existing = connection.execute(
            "SELECT 1 FROM map_layer_fog_settings WHERE map_id = ? AND layer_id = ?",
            (row["map_id"], row["id"]),
        ).fetchone()
        if existing:
            continue
        timestamp = row["updated_at"] or row["created_at"] or datetime.now(timezone.utc).isoformat()
        connection.execute(
            """
            INSERT INTO map_layer_fog_settings (map_id, layer_id, enabled, explored_areas_json, created_at, updated_at)
            VALUES (?, ?, 0, '[]', ?, ?)
            """,
            (row["map_id"], row["id"], timestamp, timestamp),
        )


def _touch_map_layer_fog_settings(connection: sqlite3.Connection, map_id: str, layer_id: str, updated_at: str) -> None:
    _ensure_map_fog_settings(connection)
    connection.execute(
        """
        UPDATE map_layer_fog_settings
        SET updated_at = ?
        WHERE map_id = ? AND layer_id = ?
        """,
        (updated_at, map_id, layer_id),
    )


def _ensure_default_battlemap(connection: sqlite3.Connection) -> str:
    project_id = _get_active_project_id(connection)
    existing_rows = connection.execute(
        """
              SELECT id, name, background_image_name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, fog_enabled, fog_walls_json, fog_doors_json, round_number, obstacles_json, tokens_json, created_at, updated_at
              FROM battlemaps
        WHERE project_id = ?
        ORDER BY datetime(created_at) ASC, created_at ASC
        """
        ,
        (project_id,),
    ).fetchall()
    active_battlemap_id = _get_active_battlemap_id(connection)
    if existing_rows:
        first_id = existing_rows[0][0]
        chosen_id = active_battlemap_id or first_id
        if chosen_id:
            _set_active_battlemap_id(connection, chosen_id)
        return chosen_id

    battlemap_id = uuid4().hex
    timestamp = datetime.now(timezone.utc).isoformat()
    connection.execute(
        """
            INSERT INTO battlemaps (
            id, project_id, name, background_image_name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, round_number, obstacles_json, tokens_json, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                battlemap_id,
                project_id,
                DEFAULT_BATTLEMAP_NAME,
                None,
                12,
                8,
                72,
                100,
                DEFAULT_BATTLEMAP_OBSTACLE_COLOR,
                1,
                json.dumps(_default_battlemap_obstacles(), ensure_ascii=True),
                json.dumps(_default_battlemap_tokens(), ensure_ascii=True),
                timestamp,
                timestamp,
        ),
    )
    _set_active_battlemap_id(connection, battlemap_id)
    return battlemap_id


def _resolve_map_id(connection: sqlite3.Connection, map_id: str | None = None) -> str:
    project_id = _get_active_project_id(connection)
    resolved = (map_id or "").strip() or _get_active_map_id(connection)
    if resolved:
        row = connection.execute("SELECT id FROM maps WHERE id = ? AND project_id = ?", (resolved, project_id)).fetchone()
        if row:
            return resolved
    return _ensure_default_map(connection)


def _resolve_map_layer_id(connection: sqlite3.Connection, map_id: str, layer_id: str | None = None) -> str:
    normalized_layer_id = (layer_id or "").strip()
    if normalized_layer_id:
        row = connection.execute(
            "SELECT id FROM map_layers WHERE id = ? AND map_id = ?",
            (normalized_layer_id, map_id),
        ).fetchone()
        if row:
            return row[0]
        raise ValueError("Kartenebene nicht gefunden.")

    default_row = connection.execute(
        """
        SELECT id
        FROM map_layers
        WHERE map_id = ?
        ORDER BY is_default DESC, sort_order ASC, datetime(created_at) ASC, created_at ASC
        LIMIT 1
        """,
        (map_id,),
    ).fetchone()
    if not default_row:
        _ensure_map_layers(connection)
        default_row = connection.execute(
            """
            SELECT id
            FROM map_layers
            WHERE map_id = ?
            ORDER BY is_default DESC, sort_order ASC, datetime(created_at) ASC, created_at ASC
            LIMIT 1
            """,
            (map_id,),
        ).fetchone()
    if not default_row:
        raise ValueError("Kartenebene nicht gefunden.")
    return default_row[0]


def _list_map_layers_for_map(connection: sqlite3.Connection, map_id: str) -> list[dict[str, object]]:
    connection.row_factory = sqlite3.Row
    rows = connection.execute(
        """
        SELECT id, map_id, name, image_name, background_color, canvas_width, canvas_height, sort_order, is_default, created_at, updated_at
        FROM map_layers
        WHERE map_id = ?
        ORDER BY sort_order ASC, datetime(created_at) ASC, created_at ASC
        """,
        (map_id,),
    ).fetchall()
    layers = []
    for row in rows:
        item = _map_layer_row_to_dict(row)
        if not item:
            continue
        layers.append(
            {
                **item,
                "image_url": f"/api/map-image/{map_id}?layer_id={item['id']}&ts={item['updated_at']}" if item["image_name"] else "",
            }
        )
    return layers


def _resolve_battlemap_id(connection: sqlite3.Connection, battlemap_id: str | None = None) -> str:
    project_id = _get_active_project_id(connection)
    resolved = (battlemap_id or "").strip() or _get_active_battlemap_id(connection)
    if resolved:
        row = connection.execute("SELECT id FROM battlemaps WHERE id = ? AND project_id = ?", (resolved, project_id)).fetchone()
        if row:
            return resolved
    return _ensure_default_battlemap(connection)


def _touch_map_scope(connection: sqlite3.Connection, base_key: str, map_id: str) -> str:
    updated_at = datetime.now(timezone.utc).isoformat()
    _upsert_setting(connection, _scoped_map_setting_key(base_key, map_id), updated_at)
    return updated_at


def list_maps() -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        active_map_id = _resolve_map_id(connection)
        active_surface = _get_active_surface(connection)
        rows = connection.execute(
            """
            SELECT id, name, image_name, created_at, updated_at
            FROM maps
            WHERE project_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """
            ,
            (project_id,),
        ).fetchall()

    maps = []
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        for row in rows:
            map_item = _map_row_to_dict(row)
            if not map_item:
                continue
            layers = _list_map_layers_for_map(connection, map_item["id"])
            default_layer = next((layer for layer in layers if layer["is_default"]), layers[0] if layers else None)
            maps.append(
                {
                    **map_item,
                    "is_active": map_item["id"] == active_map_id,
                    "image_url": default_layer["image_url"] if default_layer else "",
                    "default_layer_id": default_layer["id"] if default_layer else "",
                    "layers": layers,
                }
            )
    return {"maps": maps, "active_map_id": active_map_id, "active_surface": active_surface}


def list_battlemaps() -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        active_battlemap_id = _resolve_battlemap_id(connection)
        active_surface = _get_active_surface(connection)
        rows = connection.execute(
            """
              SELECT id, name, background_image_name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, fog_enabled, fog_walls_json, fog_doors_json, round_number, obstacles_json, tokens_json, created_at, updated_at
              FROM battlemaps
            WHERE project_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """
            ,
            (project_id,),
        ).fetchall()

    battlemaps = []
    for row in rows:
        item = _battlemap_row_to_dict(row)
        battlemaps.append(
            {
                **item,
                "is_active": item["id"] == active_battlemap_id,
            }
        )
    return {"battlemaps": battlemaps, "active_battlemap_id": active_battlemap_id, "active_surface": active_surface}


def get_battlemap(battlemap_id: str | None = None) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_id = _resolve_battlemap_id(connection, battlemap_id)
        row = connection.execute(
            """
              SELECT id, name, background_image_name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, fog_enabled, fog_walls_json, fog_doors_json, round_number, obstacles_json, tokens_json, created_at, updated_at
              FROM battlemaps
            WHERE id = ?
            """,
            (resolved_id,),
        ).fetchone()
    return _battlemap_row_to_dict(row)


def set_active_battlemap(battlemap_id: str) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        row = connection.execute(
            """
              SELECT id, name, background_image_name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, fog_enabled, fog_walls_json, fog_doors_json, round_number, obstacles_json, tokens_json, created_at, updated_at
              FROM battlemaps
            WHERE id = ? AND project_id = ?
            """,
            (battlemap_id, project_id),
        ).fetchone()
        if not row:
            return None
        _set_active_battlemap_id(connection, battlemap_id)
        _set_active_surface(connection, "battlemap", battlemap_id)
        connection.commit()
    return _battlemap_row_to_dict(row)


def activate_current_map_surface() -> dict[str, str] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        map_id = _resolve_map_id(connection)
        row = connection.execute(
            "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE id = ?",
            (map_id,),
        ).fetchone()
        if not row:
            return None
        _set_active_surface(connection, "map", map_id)
        connection.commit()
    return _map_row_to_dict(row)


async def create_battlemap(
    name: str,
    grid_width: int,
    grid_height: int,
    cell_size: int,
    scale_percent: int,
    obstacle_color: str = DEFAULT_BATTLEMAP_OBSTACLE_COLOR,
    background_upload: UploadFile | None = None,
) -> dict[str, object]:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Battlemap-Name darf nicht leer sein.")

    battlemap_id = uuid4().hex
    timestamp = datetime.now(timezone.utc).isoformat()
    normalized_width = _normalize_battlemap_size(grid_width, 4, 64)
    normalized_height = _normalize_battlemap_size(grid_height, 4, 64)
    normalized_cell_size = _normalize_battlemap_size(cell_size, 24, 160)
    normalized_scale_percent = _normalize_battlemap_size(scale_percent, 25, 300)
    normalized_obstacle_color = _normalize_battlemap_color(obstacle_color)
    background_image_name = ""
    if background_upload and background_upload.filename:
        original_name = _sanitize_filename(background_upload.filename)
        extension = Path(original_name).suffix.lower() or ".bin"
        background_image_name = f"{battlemap_id}{extension}"
        target_path = BATTLEMAP_DIR / background_image_name
        with target_path.open("wb") as handle:
            shutil.copyfileobj(background_upload.file, handle)

    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
        connection.execute(
            """
            INSERT INTO battlemaps (
                id, project_id, name, background_image_name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, round_number, obstacles_json, tokens_json, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                battlemap_id,
                project_id,
                normalized_name,
                background_image_name or None,
                normalized_width,
                normalized_height,
                normalized_cell_size,
                normalized_scale_percent,
                normalized_obstacle_color,
                1,
                "[]",
                "[]",
                timestamp,
                timestamp,
            ),
        )
        connection.commit()

    return get_battlemap(battlemap_id)


def update_battlemap_config(
    battlemap_id: str,
    name: str,
    grid_width: int,
    grid_height: int,
    cell_size: int,
    scale_percent: int,
    obstacle_color: str = DEFAULT_BATTLEMAP_OBSTACLE_COLOR,
) -> dict[str, object] | None:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Battlemap-Name darf nicht leer sein.")

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        existing = connection.execute(
            """
            SELECT id, name, background_image_name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, fog_enabled, fog_walls_json, fog_doors_json, round_number, obstacles_json, tokens_json, created_at, updated_at
            FROM battlemaps
            WHERE id = ?
            """,
            (battlemap_id,),
        ).fetchone()
        if not existing:
            return None

        normalized_width = _normalize_battlemap_size(grid_width, 4, 64)
        normalized_height = _normalize_battlemap_size(grid_height, 4, 64)
        normalized_cell_size = _normalize_battlemap_size(cell_size, 24, 160)
        normalized_scale_percent = _normalize_battlemap_size(scale_percent, 25, 300)
        normalized_obstacle_color = _normalize_battlemap_color(obstacle_color)
        obstacles = _normalize_battlemap_obstacles(
            json.loads(existing["obstacles_json"] or "[]"),
            normalized_width,
            normalized_height,
        )
        tokens = _normalize_battlemap_tokens(
            json.loads(existing["tokens_json"] or "[]"),
            normalized_width,
            normalized_height,
        )
        updated_at = datetime.now(timezone.utc).isoformat()
        connection.execute(
            """
            UPDATE battlemaps
            SET name = ?, grid_width = ?, grid_height = ?, cell_size = ?, scale_percent = ?, obstacle_color = ?, obstacles_json = ?, tokens_json = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                normalized_name,
                normalized_width,
                normalized_height,
                normalized_cell_size,
                normalized_scale_percent,
                normalized_obstacle_color,
                json.dumps(obstacles, ensure_ascii=True),
                json.dumps(tokens, ensure_ascii=True),
                updated_at,
                battlemap_id,
            ),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


async def save_battlemap_background(battlemap_id: str, upload: UploadFile) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        existing = connection.execute(
            "SELECT background_image_name FROM battlemaps WHERE id = ?",
            (battlemap_id,),
        ).fetchone()
        if not existing:
            return None
        original_name = _sanitize_filename(upload.filename or "battlemap.bin")
        extension = Path(original_name).suffix.lower() or ".bin"
        image_name = f"{battlemap_id}{extension}"
        target_path = BATTLEMAP_DIR / image_name
        previous_name = existing["background_image_name"] or ""
        if previous_name and previous_name != image_name:
            previous_path = BATTLEMAP_DIR / previous_name
            if previous_path.exists() and previous_path.is_file():
                previous_path.unlink()
        with target_path.open("wb") as handle:
            shutil.copyfileobj(upload.file, handle)
        updated_at = datetime.now(timezone.utc).isoformat()
        connection.execute(
            "UPDATE battlemaps SET background_image_name = ?, updated_at = ? WHERE id = ?",
            (image_name, updated_at, battlemap_id),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def get_battlemap_background_path(battlemap_id: str) -> Path | None:
    battlemap = get_battlemap(battlemap_id)
    image_name = str(battlemap.get("background_image_name") or "") if battlemap else ""
    if not image_name:
        return None
    path = BATTLEMAP_DIR / image_name
    if not path.exists() or not path.is_file():
        return None
    return path


def update_battlemap_obstacles(battlemap_id: str, obstacles: list[dict[str, object]]) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        existing = connection.execute(
            "SELECT grid_width, grid_height FROM battlemaps WHERE id = ?",
            (battlemap_id,),
        ).fetchone()
        if not existing:
            return None
        normalized = _normalize_battlemap_obstacles(
            obstacles,
            int(existing["grid_width"]),
            int(existing["grid_height"]),
        )
        connection.execute(
            "UPDATE battlemaps SET obstacles_json = ?, updated_at = ? WHERE id = ?",
            (json.dumps(normalized, ensure_ascii=True), datetime.now(timezone.utc).isoformat(), battlemap_id),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def add_battlemap_token(
    battlemap_id: str,
    name: str,
    token_type: str,
    x: int,
    y: int,
    color: str,
    initiative: int,
    move_range: int,
    attack_range: int,
    vision_range: int = DEFAULT_BATTLEMAP_TOKEN_VISION_RANGE,
    assigned_user_id: str = "",
    assigned_username: str = "",
    visibility_layer: str = PUBLIC_LAYER,
) -> dict[str, object] | None:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Token-Name darf nicht leer sein.")
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            "SELECT grid_width, grid_height, round_number, obstacles_json, tokens_json FROM battlemaps WHERE id = ?",
            (battlemap_id,),
        ).fetchone()
        if not row:
            return None
        grid_width = int(row["grid_width"])
        grid_height = int(row["grid_height"])
        obstacles = {(item["x"], item["y"]) for item in json.loads(row["obstacles_json"] or "[]")}
        tokens = json.loads(row["tokens_json"] or "[]")
        normalized_x = min(max(int(x), 0), grid_width - 1)
        normalized_y = min(max(int(y), 0), grid_height - 1)
        occupied = {(int(item.get("x", -1)), int(item.get("y", -1))) for item in tokens}
        if (normalized_x, normalized_y) in obstacles or (normalized_x, normalized_y) in occupied:
            raise ValueError("Das Zielfeld ist blockiert.")
        tokens.append(
            _battlemap_token_payload(
                uuid4().hex,
                normalized_name,
                token_type,
                normalized_x,
                normalized_y,
                str(color or ("#58c4ff" if token_type == "player" else "#ff6b6b")).strip() or "#58c4ff",
                _normalize_battlemap_size(initiative, 0, 99),
                _normalize_battlemap_size(move_range, 0, 20),
                _normalize_battlemap_size(attack_range, 0, 20),
                _normalize_battlemap_size(vision_range, 1, 24),
                assigned_user_id=assigned_user_id,
                assigned_username=assigned_username,
                visibility_layer=_normalize_visibility_layer(visibility_layer),
            )
        )
        normalized_tokens = _normalize_battlemap_tokens(tokens, grid_width, grid_height)
        prepared_tokens, round_number = _prepare_battlemap_turn_state(normalized_tokens, int(row["round_number"] or 1))
        connection.execute(
            "UPDATE battlemaps SET round_number = ?, tokens_json = ?, updated_at = ? WHERE id = ?",
            (round_number, json.dumps(prepared_tokens, ensure_ascii=True), datetime.now(timezone.utc).isoformat(), battlemap_id),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def update_battlemap_token(
    battlemap_id: str,
    token_id: str,
    *,
    x: int | None = None,
    y: int | None = None,
    name: str | None = None,
    token_type: str | None = None,
    color: str | None = None,
    initiative: int | None = None,
    move_range: int | None = None,
    attack_range: int | None = None,
    vision_range: int | None = None,
    assigned_user_id: str | None = None,
    assigned_username: str | None = None,
    visibility_layer: str | None = None,
    ignore_turn_rules: bool = False,
) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            "SELECT grid_width, grid_height, round_number, obstacles_json, tokens_json FROM battlemaps WHERE id = ?",
            (battlemap_id,),
        ).fetchone()
        if not row:
            return None
        grid_width = int(row["grid_width"])
        grid_height = int(row["grid_height"])
        round_number = max(int(row["round_number"] or 1), 1)
        obstacles = {(item["x"], item["y"]) for item in json.loads(row["obstacles_json"] or "[]")}
        tokens = json.loads(row["tokens_json"] or "[]")
        active_token_id = _active_battlemap_token_id(tokens)
        found = False
        next_tokens: list[dict[str, object]] = []
        occupied_by_other = {
            (int(item.get("x", -1)), int(item.get("y", -1)))
            for item in tokens
            if str(item.get("id")) != token_id
        }
        for item in tokens:
            if str(item.get("id")) != token_id:
                next_tokens.append(item)
                continue
            found = True
            current_x = int(item.get("x", 0))
            current_y = int(item.get("y", 0))
            next_x = min(max(int(x if x is not None else item.get("x", 0)), 0), grid_width - 1)
            next_y = min(max(int(y if y is not None else item.get("y", 0)), 0), grid_height - 1)
            if (next_x, next_y) in obstacles or (next_x, next_y) in occupied_by_other:
                raise ValueError("Das Zielfeld ist blockiert.")
            movement_requested = (next_x, next_y) != (current_x, current_y)
            if movement_requested:
                if ignore_turn_rules:
                    path_length = 0
                else:
                    if active_token_id and active_token_id != token_id:
                        raise ValueError("Dieser Token ist aktuell nicht am Zug.")
                    path_length = _battlemap_shortest_path_length(
                        current_x,
                        current_y,
                        next_x,
                        next_y,
                        grid_width=grid_width,
                        grid_height=grid_height,
                        blocked=obstacles | occupied_by_other,
                    )
                    if path_length is None:
                        raise ValueError("Das Zielfeld ist nicht erreichbar.")
                    remaining_steps = max(
                        0,
                        int(item.get("move_range", 0)) - int(item.get("steps_used", 0)),
                    )
                    if path_length > remaining_steps:
                        raise ValueError("Dieser Token hat nicht mehr genug Schritte.")
            else:
                path_length = 0
            next_tokens.append(
                {
                    "id": token_id,
                    "name": (name.strip() if name is not None else str(item.get("name") or "Token").strip()) or "Token",
                    "type": (token_type or str(item.get("type") or "player")).strip().lower(),
                    "x": next_x,
                    "y": next_y,
                    "color": (color if color is not None else str(item.get("color") or "#58c4ff")).strip() or "#58c4ff",
                    "initiative": _normalize_battlemap_size(int(initiative if initiative is not None else item.get("initiative", 10)), 0, 99),
                    "move_range": _normalize_battlemap_size(int(move_range if move_range is not None else item.get("move_range", 4)), 0, 20),
                    "attack_range": _normalize_battlemap_size(int(attack_range if attack_range is not None else item.get("attack_range", 1)), 0, 20),
                    "vision_range": _normalize_battlemap_size(
                        int(vision_range if vision_range is not None else item.get("vision_range", DEFAULT_BATTLEMAP_TOKEN_VISION_RANGE)),
                        1,
                        24,
                    ),
                    "steps_used": _normalize_battlemap_size(
                        int(item.get("steps_used", 0)) + (0 if ignore_turn_rules else path_length),
                        0,
                        20,
                    ),
                    "action_used": bool(item.get("action_used", False)),
                    "image_name": str(item.get("image_name") or item.get("image_url") or "").strip(),
                    "assigned_user_id": str(assigned_user_id if assigned_user_id is not None else item.get("assigned_user_id") or "").strip(),
                    "assigned_username": str(assigned_username if assigned_username is not None else item.get("assigned_username") or "").strip(),
                    "visibility_layer": _normalize_visibility_layer(
                        visibility_layer if visibility_layer is not None else str(item.get("visibility_layer") or "")
                    ),
                }
            )
        if not found:
            return None
        normalized_tokens = _normalize_battlemap_tokens(next_tokens, grid_width, grid_height)
        prepared_tokens, next_round_number = _prepare_battlemap_turn_state(normalized_tokens, round_number)
        connection.execute(
            "UPDATE battlemaps SET round_number = ?, tokens_json = ?, updated_at = ? WHERE id = ?",
            (next_round_number, json.dumps(prepared_tokens, ensure_ascii=True), datetime.now(timezone.utc).isoformat(), battlemap_id),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def delete_battlemap_token(battlemap_id: str, token_id: str) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            "SELECT grid_width, grid_height, round_number, tokens_json FROM battlemaps WHERE id = ?",
            (battlemap_id,),
        ).fetchone()
        if not row:
            return None
        tokens = json.loads(row["tokens_json"] or "[]")
        deleted_image_name = ""
        for item in tokens:
            if str(item.get("id")) == token_id:
                deleted_image_name = str(item.get("image_name") or item.get("image_url") or "").strip()
                break
        filtered = [item for item in tokens if str(item.get("id")) != token_id]
        if len(filtered) == len(tokens):
            return None
        normalized_tokens = _normalize_battlemap_tokens(filtered, int(row["grid_width"]), int(row["grid_height"]))
        prepared_tokens, round_number = _prepare_battlemap_turn_state(normalized_tokens, int(row["round_number"] or 1))
        connection.execute(
            "UPDATE battlemaps SET round_number = ?, tokens_json = ?, updated_at = ? WHERE id = ?",
            (round_number, json.dumps(prepared_tokens, ensure_ascii=True), datetime.now(timezone.utc).isoformat(), battlemap_id),
        )
        connection.commit()
    if deleted_image_name:
        image_path = BATTLEMAP_TOKEN_DIR / deleted_image_name
        if image_path.exists() and image_path.is_file():
            image_path.unlink()
    return get_battlemap(battlemap_id)


async def save_battlemap_token_image(
    battlemap_id: str,
    token_id: str,
    upload: UploadFile,
) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            "SELECT grid_width, grid_height, tokens_json FROM battlemaps WHERE id = ?",
            (battlemap_id,),
        ).fetchone()
        if not row:
            return None
        tokens = json.loads(row["tokens_json"] or "[]")
        found = False
        next_tokens: list[dict[str, object]] = []
        original_name = _sanitize_filename(upload.filename or "token.bin")
        extension = Path(original_name).suffix.lower() or ".bin"
        image_name = f"{token_id}{extension}"
        target_path = BATTLEMAP_TOKEN_DIR / image_name
        for item in tokens:
            next_item = dict(item)
            if str(item.get("id")) == token_id:
                previous_name = str(item.get("image_name") or item.get("image_url") or "").strip()
                if previous_name and previous_name != image_name:
                    previous_path = BATTLEMAP_TOKEN_DIR / previous_name
                    if previous_path.exists() and previous_path.is_file():
                        previous_path.unlink()
                next_item["image_name"] = image_name
                found = True
            next_tokens.append(next_item)
        if not found:
            return None
        with target_path.open("wb") as handle:
            shutil.copyfileobj(upload.file, handle)
        normalized_tokens = _normalize_battlemap_tokens(next_tokens, int(row["grid_width"]), int(row["grid_height"]))
        connection.execute(
            "UPDATE battlemaps SET tokens_json = ?, updated_at = ? WHERE id = ?",
            (json.dumps(normalized_tokens, ensure_ascii=True), datetime.now(timezone.utc).isoformat(), battlemap_id),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def get_battlemap_token_image_path(token_id: str) -> Path | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute("SELECT tokens_json FROM battlemaps").fetchall()
    for row in rows:
        for item in json.loads(row["tokens_json"] or "[]"):
            if str(item.get("id")) != token_id:
                continue
            image_name = str(item.get("image_name") or item.get("image_url") or "").strip()
            if not image_name:
                return None
            image_path = BATTLEMAP_TOKEN_DIR / Path(image_name).name
            if image_path.exists() and image_path.is_file():
                return image_path
            return None
    return None


def end_battlemap_token_turn(battlemap_id: str, token_id: str) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            "SELECT grid_width, grid_height, round_number, tokens_json FROM battlemaps WHERE id = ?",
            (battlemap_id,),
        ).fetchone()
        if not row:
            return None
        round_number = max(int(row["round_number"] or 1), 1)
        tokens = _normalize_battlemap_tokens(
            json.loads(row["tokens_json"] or "[]"),
            int(row["grid_width"]),
            int(row["grid_height"]),
        )
        active_token_id = _active_battlemap_token_id(tokens)
        if active_token_id and active_token_id != token_id:
            raise ValueError("Dieser Token ist aktuell nicht am Zug.")
        found = False
        next_tokens: list[dict[str, object]] = []
        for item in tokens:
            next_item = dict(item)
            if str(item.get("id")) == token_id:
                next_item["steps_used"] = int(item.get("move_range", 0))
                next_item["action_used"] = True
                found = True
            next_tokens.append(next_item)
        if not found:
            return None
        prepared_tokens, next_round = _prepare_battlemap_turn_state(next_tokens, round_number)
        connection.execute(
            "UPDATE battlemaps SET round_number = ?, tokens_json = ?, updated_at = ? WHERE id = ?",
            (next_round, json.dumps(prepared_tokens, ensure_ascii=True), datetime.now(timezone.utc).isoformat(), battlemap_id),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def set_active_map(map_id: str) -> dict[str, str] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        row = connection.execute(
            "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE id = ? AND project_id = ?",
            (map_id, project_id),
        ).fetchone()
        if not row:
            return None
        _set_active_map_id(connection, map_id)
        _set_active_surface(connection, "map", map_id)
        connection.commit()
    return _map_row_to_dict(row)


def rename_map(map_id: str, name: str) -> dict[str, str] | None:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Kartenname darf nicht leer sein.")

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        connection.execute(
            "UPDATE maps SET name = ?, updated_at = ? WHERE id = ? AND project_id = ?",
            (normalized_name, datetime.now(timezone.utc).isoformat(), map_id, project_id),
        )
        if connection.total_changes == 0:
            return None
        row = connection.execute(
            "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE id = ? AND project_id = ?",
            (map_id, project_id),
        ).fetchone()
        connection.commit()
    return _map_row_to_dict(row)


def delete_map(map_id: str) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        row = connection.execute(
            "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE id = ? AND project_id = ?",
            (map_id, project_id),
        ).fetchone()
        if not row:
            return None

        pin_image_rows = connection.execute(
            "SELECT image_name FROM map_pins WHERE map_id = ? AND image_name IS NOT NULL AND image_name != ''",
            (map_id,),
        ).fetchall()
        overlay_image_rows = connection.execute(
            "SELECT image_name FROM map_overlays WHERE map_id = ? AND image_name IS NOT NULL AND image_name != ''",
            (map_id,),
        ).fetchall()
        map_layer_rows = connection.execute(
            "SELECT image_name FROM map_layers WHERE map_id = ? AND image_name IS NOT NULL AND image_name != ''",
            (map_id,),
        ).fetchall()
        replacement_row = connection.execute(
            """
            SELECT id, name, image_name, created_at, updated_at
            FROM maps
            WHERE id != ? AND project_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            LIMIT 1
            """,
            (map_id, project_id),
        ).fetchone()

        active_map_id = _get_active_map_id(connection)
        if active_map_id == map_id:
            if replacement_row:
                _set_active_map_id(connection, replacement_row["id"])
                _set_active_surface(connection, "map", replacement_row["id"])
            else:
                _set_active_map_id(connection, "")
                connection.execute(
                    "DELETE FROM app_settings WHERE key IN (?, ?)",
                    (
                        _project_setting_key(ACTIVE_SURFACE_KIND_SETTING_KEY, project_id),
                        _project_setting_key(ACTIVE_SURFACE_ID_SETTING_KEY, project_id),
                    ),
                )

        connection.execute("DELETE FROM map_draw_strokes WHERE map_id = ?", (map_id,))
        connection.execute("DELETE FROM map_pings WHERE map_id = ?", (map_id,))
        connection.execute("DELETE FROM map_pins WHERE map_id = ?", (map_id,))
        connection.execute("DELETE FROM map_overlays WHERE map_id = ?", (map_id,))
        connection.execute("DELETE FROM map_layers WHERE map_id = ?", (map_id,))
        connection.execute("DELETE FROM maps WHERE id = ?", (map_id,))
        connection.execute(
            "DELETE FROM app_settings WHERE key IN (?, ?, ?, ?)",
            (
                _scoped_map_setting_key(MAP_DRAWINGS_UPDATED_AT_SETTING_KEY, map_id),
                _scoped_map_setting_key(MAP_PINGS_UPDATED_AT_SETTING_KEY, map_id),
                _scoped_map_setting_key(MAP_PINS_UPDATED_AT_SETTING_KEY, map_id),
                _scoped_map_setting_key(MAP_OVERLAYS_UPDATED_AT_SETTING_KEY, map_id),
            ),
        )
        connection.commit()

    for map_layer_row in map_layer_rows:
        layer_image_name = map_layer_row["image_name"] or ""
        if not layer_image_name:
            continue
        layer_image_path = MAP_LAYER_DIR / layer_image_name
        if layer_image_path.exists() and layer_image_path.is_file():
            layer_image_path.unlink()

    for pin_image_row in pin_image_rows:
        pin_image_name = pin_image_row["image_name"] or ""
        if not pin_image_name:
            continue
        pin_image_path = MAP_PIN_DIR / pin_image_name
        if pin_image_path.exists() and pin_image_path.is_file():
            pin_image_path.unlink()
    for overlay_image_row in overlay_image_rows:
        overlay_image_name = overlay_image_row["image_name"] or ""
        if not overlay_image_name:
            continue
        overlay_image_path = MAP_OVERLAY_DIR / overlay_image_name
        if overlay_image_path.exists() and overlay_image_path.is_file():
            overlay_image_path.unlink()

    return {
        "deleted_map_id": map_id,
        "active_map_id": replacement_row["id"] if replacement_row else "",
    }


async def create_map(
    name: str,
    image_upload: UploadFile | None = None,
    background_color: str | None = None,
    canvas_width: int | None = None,
    canvas_height: int | None = None,
) -> dict[str, str]:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Kartenname darf nicht leer sein.")

    map_id = uuid4().hex
    layer_id = uuid4().hex
    timestamp = datetime.now(timezone.utc).isoformat()
    normalized_background_color = _normalize_map_background_color(background_color)
    normalized_canvas_width = _normalize_map_canvas_size(canvas_width)
    normalized_canvas_height = _normalize_map_canvas_size(canvas_height)
    image_name = ""
    if image_upload and image_upload.filename:
        original_name = _sanitize_filename(image_upload.filename)
        extension = Path(original_name).suffix.lower() or ".bin"
        image_name = f"{map_id}-{layer_id}{extension}"
        target_path = MAP_LAYER_DIR / image_name
        with target_path.open("wb") as handle:
            shutil.copyfileobj(image_upload.file, handle)

    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            INSERT INTO maps (id, project_id, name, image_name, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (map_id, _resolve_project_id(connection), normalized_name, image_name or None, timestamp, timestamp),
        )
        connection.execute(
            """
            INSERT INTO map_layers (id, map_id, name, image_name, background_color, canvas_width, canvas_height, sort_order, is_default, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                layer_id,
                map_id,
                "Ebene 1",
                image_name or None,
                normalized_background_color,
                normalized_canvas_width,
                normalized_canvas_height,
                0,
                1,
                timestamp,
                timestamp,
            ),
        )
        connection.commit()

    return {
        "id": map_id,
        "name": normalized_name,
        "image_name": image_name,
        "image_url": f"/api/map-image/{map_id}?ts={timestamp}" if image_name else "",
        "background_color": normalized_background_color,
        "canvas_width": normalized_canvas_width,
        "canvas_height": normalized_canvas_height,
        "default_layer_id": layer_id,
        "created_at": timestamp,
        "updated_at": timestamp,
    }


async def create_map_layer(
    name: str,
    map_id: str,
    image_upload: UploadFile | None = None,
    background_color: str | None = None,
    canvas_width: int | None = None,
    canvas_height: int | None = None,
) -> dict[str, object]:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Ebenenname darf nicht leer sein.")

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        map_row = connection.execute(
            "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE id = ?",
            (resolved_map_id,),
        ).fetchone()
        if not map_row:
            raise ValueError("Karte nicht gefunden.")
        next_sort_order_row = connection.execute(
            "SELECT COALESCE(MAX(sort_order), -1) + 1 FROM map_layers WHERE map_id = ?",
            (resolved_map_id,),
        ).fetchone()
        sort_order = int(next_sort_order_row[0] or 0)
        normalized_background_color = _normalize_map_background_color(background_color)
        normalized_canvas_width = _normalize_map_canvas_size(canvas_width)
        normalized_canvas_height = _normalize_map_canvas_size(canvas_height)
        layer_id = uuid4().hex
        timestamp = datetime.now(timezone.utc).isoformat()
        image_name = ""
        if image_upload and image_upload.filename:
            original_name = _sanitize_filename(image_upload.filename)
            extension = Path(original_name).suffix.lower() or ".bin"
            image_name = f"{resolved_map_id}-{layer_id}{extension}"
            target_path = MAP_LAYER_DIR / image_name
            with target_path.open("wb") as handle:
                shutil.copyfileobj(image_upload.file, handle)
        connection.execute(
            """
            INSERT INTO map_layers (id, map_id, name, image_name, background_color, canvas_width, canvas_height, sort_order, is_default, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                layer_id,
                resolved_map_id,
                normalized_name,
                image_name or None,
                normalized_background_color,
                normalized_canvas_width,
                normalized_canvas_height,
                sort_order,
                0,
                timestamp,
                timestamp,
            ),
        )
        connection.execute(
            "UPDATE maps SET updated_at = ? WHERE id = ?",
            (timestamp, resolved_map_id),
        )
        connection.commit()
    return {
        "id": layer_id,
        "map_id": resolved_map_id,
        "name": normalized_name,
        "image_name": image_name,
        "background_color": normalized_background_color,
        "canvas_width": normalized_canvas_width,
        "canvas_height": normalized_canvas_height,
        "sort_order": sort_order,
        "is_default": False,
        "created_at": timestamp,
        "updated_at": timestamp,
        "image_url": f"/api/map-image/{resolved_map_id}?layer_id={layer_id}&ts={timestamp}" if image_name else "",
    }


def list_map_layers(map_id: str | None = None) -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        map_row = connection.execute(
            "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE id = ?",
            (resolved_map_id,),
        ).fetchone()
        if not map_row:
            raise ValueError("Karte nicht gefunden.")
        layers = _list_map_layers_for_map(connection, resolved_map_id)
    return {
        "map_id": resolved_map_id,
        "map_name": map_row["name"],
        "layers": layers,
        "default_layer_id": next((layer["id"] for layer in layers if layer["is_default"]), layers[0]["id"] if layers else ""),
    }


def get_map_layer_fog(map_id: str | None = None, layer_id: str | None = None) -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        _ensure_map_fog_settings(connection)
        row = connection.execute(
            """
            SELECT map_id, layer_id, enabled, explored_areas_json, created_at, updated_at
            FROM map_layer_fog_settings
            WHERE map_id = ? AND layer_id = ?
            """,
            (resolved_map_id, resolved_layer_id),
        ).fetchone()
        walls = connection.execute(
            """
            SELECT id, x1, y1, x2, y2, created_at, updated_at
            FROM map_layer_fog_walls
            WHERE map_id = ? AND layer_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """,
            (resolved_map_id, resolved_layer_id),
        ).fetchall()
        doors = connection.execute(
            """
            SELECT id, x1, y1, x2, y2, is_open, created_at, updated_at
            FROM map_layer_fog_doors
            WHERE map_id = ? AND layer_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """,
            (resolved_map_id, resolved_layer_id),
        ).fetchall()
    explored_areas = _normalize_fog_areas(json.loads(row["explored_areas_json"] or "[]")) if row else []
    return {
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
        "enabled": bool(row["enabled"]) if row else False,
        "explored_areas": explored_areas,
        "walls": [
            {
                "id": wall["id"],
                "x1": wall["x1"],
                "y1": wall["y1"],
                "x2": wall["x2"],
                "y2": wall["y2"],
                "created_at": wall["created_at"],
                "updated_at": wall["updated_at"],
            }
            for wall in walls
        ],
        "doors": [
            {
                "id": door["id"],
                "x1": door["x1"],
                "y1": door["y1"],
                "x2": door["x2"],
                "y2": door["y2"],
                "is_open": bool(door["is_open"]),
                "created_at": door["created_at"],
                "updated_at": door["updated_at"],
            }
            for door in doors
        ],
        "updated_at": row["updated_at"] if row else "",
    }


def update_map_layer_fog(
    map_id: str,
    layer_id: str,
    *,
    enabled: bool | None = None,
    explored_areas: list[dict[str, float]] | None = None,
) -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        _ensure_map_fog_settings(connection)
        current = connection.execute(
            """
            SELECT enabled, explored_areas_json
            FROM map_layer_fog_settings
            WHERE map_id = ? AND layer_id = ?
            """,
            (resolved_map_id, resolved_layer_id),
        ).fetchone()
        next_enabled = int(bool(enabled)) if enabled is not None else int(current["enabled"])
        next_explored = _normalize_fog_areas(explored_areas) if explored_areas is not None else _normalize_fog_areas(json.loads(current["explored_areas_json"] or "[]"))
        updated_at = datetime.now(timezone.utc).isoformat()
        connection.execute(
            """
            UPDATE map_layer_fog_settings
            SET enabled = ?, explored_areas_json = ?, updated_at = ?
            WHERE map_id = ? AND layer_id = ?
            """,
            (next_enabled, json.dumps(next_explored, ensure_ascii=True), updated_at, resolved_map_id, resolved_layer_id),
        )
        _touch_map_scope(connection, MAP_FOG_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()
    return get_map_layer_fog(resolved_map_id, resolved_layer_id)


def _merge_explored_fog_areas(
    existing_areas: list[dict[str, float]] | None,
    new_areas: list[dict[str, float]] | None,
) -> list[dict[str, float]]:
    merged = _normalize_fog_areas(existing_areas or [])
    for area in _normalize_fog_areas(new_areas or []):
        duplicate = False
        for current in merged:
            dx = float(current.get("x", 0.0)) - area["x"]
            dy = float(current.get("y", 0.0)) - area["y"]
            distance = math.sqrt((dx * dx) + (dy * dy))
            if distance <= max(float(current.get("radius", 0.0)), area["radius"]) * 0.35:
                duplicate = True
                break
        if not duplicate:
            merged.append(area)
    return merged[-250:]


def _reveal_map_fog_for_tokens(
    connection: sqlite3.Connection,
    map_id: str,
    layer_id: str,
    token_rows: list[sqlite3.Row | dict[str, object]],
) -> None:
    if not map_id or not layer_id or not token_rows:
        return
    _ensure_map_fog_settings(connection)
    fog_row = connection.execute(
        """
        SELECT enabled, explored_areas_json
        FROM map_layer_fog_settings
        WHERE map_id = ? AND layer_id = ?
        """,
        (map_id, layer_id),
    ).fetchone()
    if not fog_row or not bool(fog_row["enabled"]):
        return

    new_areas: list[dict[str, float]] = []
    for token in token_rows:
        token_type = str(token["pin_type"] if isinstance(token, sqlite3.Row) else token.get("pin_type", "pin") or "pin").strip().lower()
        visibility_layer = _normalize_visibility_layer(
            token["visibility_layer"] if isinstance(token, sqlite3.Row) else token.get("visibility_layer", PUBLIC_LAYER)
        )
        if token_type != "token" or visibility_layer != PUBLIC_LAYER:
            continue
        new_areas.append(
            {
                "x": min(max(float(token["x"] if isinstance(token, sqlite3.Row) else token.get("x", 0.0)), 0.0), 1.0),
                "y": min(max(float(token["y"] if isinstance(token, sqlite3.Row) else token.get("y", 0.0)), 0.0), 1.0),
                "radius": _normalize_vision_radius(
                    token["vision_radius"] if isinstance(token, sqlite3.Row) else token.get("vision_radius", DEFAULT_MAP_TOKEN_VISION_RADIUS)
                ),
            }
        )
    if not new_areas:
        return

    existing_areas = _normalize_fog_areas(json.loads(fog_row["explored_areas_json"] or "[]"))
    merged_areas = _merge_explored_fog_areas(existing_areas, new_areas)
    if merged_areas == existing_areas:
        return

    updated_at = datetime.now(timezone.utc).isoformat()
    connection.execute(
        """
        UPDATE map_layer_fog_settings
        SET explored_areas_json = ?, updated_at = ?
        WHERE map_id = ? AND layer_id = ?
        """,
        (json.dumps(merged_areas, ensure_ascii=True), updated_at, map_id, layer_id),
    )
    _touch_map_scope(connection, MAP_FOG_UPDATED_AT_SETTING_KEY, map_id)


def add_map_layer_fog_wall(map_id: str, layer_id: str, x1: float, y1: float, x2: float, y2: float) -> dict[str, object]:
    init_storage()
    wall_id = uuid4().hex
    created_at = datetime.now(timezone.utc).isoformat()
    values = (
        min(max(float(x1), 0.0), 1.0),
        min(max(float(y1), 0.0), 1.0),
        min(max(float(x2), 0.0), 1.0),
        min(max(float(y2), 0.0), 1.0),
    )
    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute(
            """
            INSERT INTO map_layer_fog_walls (id, map_id, layer_id, x1, y1, x2, y2, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (wall_id, resolved_map_id, resolved_layer_id, values[0], values[1], values[2], values[3], created_at, created_at),
        )
        _touch_map_layer_fog_settings(connection, resolved_map_id, resolved_layer_id, created_at)
        _touch_map_scope(connection, MAP_FOG_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()
    return {
        "id": wall_id,
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
        "x1": values[0],
        "y1": values[1],
        "x2": values[2],
        "y2": values[3],
        "created_at": created_at,
        "updated_at": created_at,
    }


def delete_map_layer_fog_wall(map_id: str, layer_id: str, wall_id: str) -> bool:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute(
            "DELETE FROM map_layer_fog_walls WHERE id = ? AND map_id = ? AND layer_id = ?",
            (wall_id, resolved_map_id, resolved_layer_id),
        )
        deleted = connection.total_changes > 0
        if deleted:
            _touch_map_layer_fog_settings(connection, resolved_map_id, resolved_layer_id, datetime.now(timezone.utc).isoformat())
            _touch_map_scope(connection, MAP_FOG_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()
    return deleted


def add_map_layer_fog_door(
    map_id: str,
    layer_id: str,
    x1: float,
    y1: float,
    x2: float,
    y2: float,
    *,
    is_open: bool = False,
) -> dict[str, object]:
    init_storage()
    door_id = uuid4().hex
    created_at = datetime.now(timezone.utc).isoformat()
    values = (
        min(max(float(x1), 0.0), 1.0),
        min(max(float(y1), 0.0), 1.0),
        min(max(float(x2), 0.0), 1.0),
        min(max(float(y2), 0.0), 1.0),
    )
    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute(
            """
            INSERT INTO map_layer_fog_doors (id, map_id, layer_id, x1, y1, x2, y2, is_open, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                door_id,
                resolved_map_id,
                resolved_layer_id,
                values[0],
                values[1],
                values[2],
                values[3],
                int(bool(is_open)),
                created_at,
                created_at,
            ),
        )
        _touch_map_layer_fog_settings(connection, resolved_map_id, resolved_layer_id, created_at)
        _touch_map_scope(connection, MAP_FOG_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()
    return {
        "id": door_id,
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
        "x1": values[0],
        "y1": values[1],
        "x2": values[2],
        "y2": values[3],
        "is_open": bool(is_open),
        "created_at": created_at,
        "updated_at": created_at,
    }


def update_map_layer_fog_door(map_id: str, layer_id: str, door_id: str, *, is_open: bool) -> dict[str, object] | None:
    init_storage()
    updated_at = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute(
            """
            UPDATE map_layer_fog_doors
            SET is_open = ?, updated_at = ?
            WHERE id = ? AND map_id = ? AND layer_id = ?
            """,
            (int(bool(is_open)), updated_at, door_id, resolved_map_id, resolved_layer_id),
        )
        if connection.total_changes <= 0:
            connection.commit()
            return None
        _touch_map_layer_fog_settings(connection, resolved_map_id, resolved_layer_id, updated_at)
        _touch_map_scope(connection, MAP_FOG_UPDATED_AT_SETTING_KEY, resolved_map_id)
        row = connection.execute(
            """
            SELECT id, x1, y1, x2, y2, is_open, created_at, updated_at
            FROM map_layer_fog_doors
            WHERE id = ? AND map_id = ? AND layer_id = ?
            """,
            (door_id, resolved_map_id, resolved_layer_id),
        ).fetchone()
        connection.commit()
    if not row:
        return None
    return {
        "id": row["id"],
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
        "x1": row["x1"],
        "y1": row["y1"],
        "x2": row["x2"],
        "y2": row["y2"],
        "is_open": bool(row["is_open"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def delete_map_layer_fog_door(map_id: str, layer_id: str, door_id: str) -> bool:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute(
            "DELETE FROM map_layer_fog_doors WHERE id = ? AND map_id = ? AND layer_id = ?",
            (door_id, resolved_map_id, resolved_layer_id),
        )
        deleted = connection.total_changes > 0
        if deleted:
            _touch_map_layer_fog_settings(connection, resolved_map_id, resolved_layer_id, datetime.now(timezone.utc).isoformat())
            _touch_map_scope(connection, MAP_FOG_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()
    return deleted


def _normalize_battlemap_fog_segments(
    segments: list[dict[str, object]] | None,
    *,
    grid_width: int,
    grid_height: int,
    include_door_state: bool = False,
) -> list[dict[str, object]]:
    normalized: list[dict[str, object]] = []
    seen: set[tuple[int, int, int, int]] = set()
    for segment in segments or []:
        try:
            x1 = int(segment.get("x1", 0))
            y1 = int(segment.get("y1", 0))
            x2 = int(segment.get("x2", 0))
            y2 = int(segment.get("y2", 0))
        except (TypeError, ValueError, AttributeError):
            continue
        x1 = min(max(x1, 0), grid_width)
        y1 = min(max(y1, 0), grid_height)
        x2 = min(max(x2, 0), grid_width)
        y2 = min(max(y2, 0), grid_height)
        dx = abs(x2 - x1)
        dy = abs(y2 - y1)
        shape = "edge"
        if dx == 1 and dy == 1:
            shape = "cell"
        elif dx + dy != 1:
            continue
        if shape == "edge" and (x2, y2) < (x1, y1):
            x1, y1, x2, y2 = x2, y2, x1, y1
        key = (shape, x1, y1, x2, y2)
        if key in seen:
            continue
        seen.add(key)
        entry = {
            "id": str(segment.get("id") or uuid4().hex),
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
            "shape": shape,
        }
        if include_door_state:
            entry["is_open"] = bool(segment.get("is_open", False))
        normalized.append(entry)
    return normalized


def _load_battlemap_fog_state(
    connection: sqlite3.Connection,
    battlemap_id: str,
) -> tuple[sqlite3.Row | None, int, int, list[dict[str, object]], list[dict[str, object]], list[dict[str, object]]]:
    connection.row_factory = sqlite3.Row
    row = connection.execute(
        """
        SELECT grid_width, grid_height, fog_enabled, fog_walls_json, fog_doors_json, tokens_json
        FROM battlemaps
        WHERE id = ?
        """,
        (battlemap_id,),
    ).fetchone()
    if not row:
        return None, 0, 0, [], [], []
    grid_width = int(row["grid_width"])
    grid_height = int(row["grid_height"])
    walls = _normalize_battlemap_fog_segments(
        json.loads(row["fog_walls_json"] or "[]"),
        grid_width=grid_width,
        grid_height=grid_height,
    )
    doors = _normalize_battlemap_fog_segments(
        json.loads(row["fog_doors_json"] or "[]"),
        grid_width=grid_width,
        grid_height=grid_height,
        include_door_state=True,
    )
    tokens = _normalize_battlemap_tokens(json.loads(row["tokens_json"] or "[]"), grid_width, grid_height)
    return row, grid_width, grid_height, walls, doors, tokens


def update_battlemap_fog(
    battlemap_id: str,
    *,
    enabled: bool | None = None,
) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row, _, _, walls, doors, _ = _load_battlemap_fog_state(connection, battlemap_id)
        if not row:
            return None
        next_enabled = bool(row["fog_enabled"]) if enabled is None else bool(enabled)
        connection.execute(
            """
            UPDATE battlemaps
            SET fog_enabled = ?, fog_walls_json = ?, fog_doors_json = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                int(next_enabled),
                json.dumps(walls, ensure_ascii=True),
                json.dumps(doors, ensure_ascii=True),
                datetime.now(timezone.utc).isoformat(),
                battlemap_id,
            ),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def add_battlemap_fog_wall(
    battlemap_id: str,
    *,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row, grid_width, grid_height, walls, doors, _ = _load_battlemap_fog_state(connection, battlemap_id)
        if not row:
            return None
        next_walls = _normalize_battlemap_fog_segments(
            [*walls, {"id": uuid4().hex, "x1": x1, "y1": y1, "x2": x2, "y2": y2}],
            grid_width=grid_width,
            grid_height=grid_height,
        )
        door_keys = {
            (str(door.get("shape") or "edge"), door["x1"], door["y1"], door["x2"], door["y2"])
            for door in doors
        }
        next_walls = [
            wall
            for wall in next_walls
            if (str(wall.get("shape") or "edge"), wall["x1"], wall["y1"], wall["x2"], wall["y2"]) not in door_keys
        ]
        connection.execute(
            "UPDATE battlemaps SET fog_walls_json = ?, updated_at = ? WHERE id = ?",
            (json.dumps(next_walls, ensure_ascii=True), datetime.now(timezone.utc).isoformat(), battlemap_id),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def add_battlemap_fog_door(
    battlemap_id: str,
    *,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
    is_open: bool = False,
) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row, grid_width, grid_height, walls, doors, _ = _load_battlemap_fog_state(connection, battlemap_id)
        if not row:
            return None
        next_doors = _normalize_battlemap_fog_segments(
            [*doors, {"id": uuid4().hex, "x1": x1, "y1": y1, "x2": x2, "y2": y2, "is_open": is_open}],
            grid_width=grid_width,
            grid_height=grid_height,
            include_door_state=True,
        )
        door_keys = {
            (str(door.get("shape") or "edge"), door["x1"], door["y1"], door["x2"], door["y2"])
            for door in next_doors
        }
        next_walls = [
            wall
            for wall in walls
            if (str(wall.get("shape") or "edge"), wall["x1"], wall["y1"], wall["x2"], wall["y2"]) not in door_keys
        ]
        connection.execute(
            "UPDATE battlemaps SET fog_walls_json = ?, fog_doors_json = ?, updated_at = ? WHERE id = ?",
            (
                json.dumps(next_walls, ensure_ascii=True),
                json.dumps(next_doors, ensure_ascii=True),
                datetime.now(timezone.utc).isoformat(),
                battlemap_id,
            ),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def update_battlemap_fog_door(
    battlemap_id: str,
    door_id: str,
    *,
    is_open: bool,
) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row, grid_width, grid_height, walls, doors, _ = _load_battlemap_fog_state(connection, battlemap_id)
        if not row:
            return None
        found = False
        updated_doors: list[dict[str, object]] = []
        for door in doors:
            next_door = dict(door)
            if str(door.get("id") or "") == door_id:
                next_door["is_open"] = bool(is_open)
                found = True
            updated_doors.append(next_door)
        if not found:
            return None
        next_doors = _normalize_battlemap_fog_segments(
            updated_doors,
            grid_width=grid_width,
            grid_height=grid_height,
            include_door_state=True,
        )
        connection.execute(
            "UPDATE battlemaps SET fog_walls_json = ?, fog_doors_json = ?, updated_at = ? WHERE id = ?",
            (
                json.dumps(walls, ensure_ascii=True),
                json.dumps(next_doors, ensure_ascii=True),
                datetime.now(timezone.utc).isoformat(),
                battlemap_id,
            ),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def delete_last_battlemap_fog_element(
    battlemap_id: str,
    *,
    element_type: str = "",
) -> dict[str, object] | None:
    init_storage()
    normalized_type = str(element_type or "").strip().lower()
    with sqlite3.connect(DB_PATH) as connection:
        row, _, _, walls, doors, _ = _load_battlemap_fog_state(connection, battlemap_id)
        if not row:
            return None
        next_walls = list(walls)
        next_doors = list(doors)
        if normalized_type == "wall":
            if not next_walls:
                return get_battlemap(battlemap_id)
            next_walls.pop()
        elif normalized_type == "door":
            if not next_doors:
                return get_battlemap(battlemap_id)
            next_doors.pop()
        else:
            if next_doors:
                next_doors.pop()
            elif next_walls:
                next_walls.pop()
            else:
                return get_battlemap(battlemap_id)
        connection.execute(
            "UPDATE battlemaps SET fog_walls_json = ?, fog_doors_json = ?, updated_at = ? WHERE id = ?",
            (
                json.dumps(next_walls, ensure_ascii=True),
                json.dumps(next_doors, ensure_ascii=True),
                datetime.now(timezone.utc).isoformat(),
                battlemap_id,
            ),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def delete_battlemap_fog_segment(
    battlemap_id: str,
    *,
    element_type: str,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
) -> dict[str, object] | None:
    init_storage()
    normalized_type = str(element_type or "").strip().lower()
    if normalized_type not in {"wall", "door"}:
        raise ValueError("Ungueltiger Fog-Elementtyp.")
    with sqlite3.connect(DB_PATH) as connection:
        row, grid_width, grid_height, walls, doors, _ = _load_battlemap_fog_state(connection, battlemap_id)
        if not row:
            return None
        target_items = _normalize_battlemap_fog_segments(
            [{"x1": x1, "y1": y1, "x2": x2, "y2": y2}],
            grid_width=grid_width,
            grid_height=grid_height,
            include_door_state=(normalized_type == "door"),
        )
        if not target_items:
            raise ValueError("Ungueltiges Fog-Element.")
        target = target_items[0]
        target_key = (
            str(target.get("shape") or "edge"),
            int(target["x1"]),
            int(target["y1"]),
            int(target["x2"]),
            int(target["y2"]),
        )
        if normalized_type == "wall":
            next_walls = [
                wall for wall in walls
                if (
                    str(wall.get("shape") or "edge"),
                    int(wall["x1"]),
                    int(wall["y1"]),
                    int(wall["x2"]),
                    int(wall["y2"]),
                ) != target_key
            ]
            next_doors = list(doors)
        else:
            next_doors = [
                door for door in doors
                if (
                    str(door.get("shape") or "edge"),
                    int(door["x1"]),
                    int(door["y1"]),
                    int(door["x2"]),
                    int(door["y2"]),
                ) != target_key
            ]
            next_walls = list(walls)
        connection.execute(
            "UPDATE battlemaps SET fog_walls_json = ?, fog_doors_json = ?, updated_at = ? WHERE id = ?",
            (
                json.dumps(next_walls, ensure_ascii=True),
                json.dumps(next_doors, ensure_ascii=True),
                datetime.now(timezone.utc).isoformat(),
                battlemap_id,
            ),
        )
        connection.commit()
    return get_battlemap(battlemap_id)


def rename_map_layer(map_id: str, layer_id: str, name: str) -> dict[str, object]:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Ebenenname darf nicht leer sein.")
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        updated_at = datetime.now(timezone.utc).isoformat()
        connection.execute(
            "UPDATE map_layers SET name = ?, updated_at = ? WHERE id = ? AND map_id = ?",
            (normalized_name, updated_at, resolved_layer_id, resolved_map_id),
        )
        if connection.total_changes == 0:
            raise ValueError("Kartenebene nicht gefunden.")
        connection.execute(
            "UPDATE maps SET updated_at = ? WHERE id = ?",
            (updated_at, resolved_map_id),
        )
        row = connection.execute(
            """
            SELECT id, map_id, name, image_name, background_color, canvas_width, canvas_height, sort_order, is_default, created_at, updated_at
            FROM map_layers
            WHERE id = ? AND map_id = ?
            """,
            (resolved_layer_id, resolved_map_id),
        ).fetchone()
        connection.commit()
    layer = _map_layer_row_to_dict(row)
    if not layer:
        raise ValueError("Kartenebene nicht gefunden.")
    return {
        **layer,
        "image_url": f"/api/map-image/{resolved_map_id}?layer_id={resolved_layer_id}&ts={layer['updated_at']}" if layer["image_name"] else "",
    }


async def save_map_image(upload: UploadFile, map_id: str | None = None, layer_id: str | None = None) -> dict[str, str]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        current_row = connection.execute(
            "SELECT id, image_name, is_default FROM map_layers WHERE id = ? AND map_id = ?",
            (resolved_layer_id, resolved_map_id),
        ).fetchone()
        if not current_row:
            raise ValueError("Karte nicht gefunden.")

        original_name = _sanitize_filename(upload.filename or "map.bin")
        extension = Path(original_name).suffix.lower() or ".bin"
        stored_name = f"{resolved_map_id}-{resolved_layer_id}{extension}"
        target_path = MAP_LAYER_DIR / stored_name
        updated_at = datetime.now(timezone.utc).isoformat()

        old_image_name = current_row["image_name"] or ""
        if old_image_name and old_image_name != stored_name:
            old_image_path = MAP_LAYER_DIR / old_image_name
            if old_image_path.exists() and old_image_path.is_file():
                old_image_path.unlink()

        with target_path.open("wb") as handle:
            shutil.copyfileobj(upload.file, handle)

        connection.execute(
            "UPDATE map_layers SET image_name = ?, updated_at = ? WHERE id = ?",
            (stored_name, updated_at, resolved_layer_id),
        )
        connection.execute(
            "UPDATE maps SET updated_at = ? WHERE id = ?",
            (updated_at, resolved_map_id),
        )
        if bool(current_row["is_default"]):
            connection.execute(
                "UPDATE maps SET image_name = ? WHERE id = ?",
                (stored_name, resolved_map_id),
            )
        connection.commit()

    return {
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
        "file_name": stored_name,
        "updated_at": updated_at,
    }

def get_map_image_info(map_id: str | None = None, layer_id: str | None = None) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        map_row = connection.execute(
            "SELECT id, name, image_name, created_at, updated_at FROM maps WHERE id = ?",
            (resolved_map_id,),
        ).fetchone()
        if not map_row:
            return None
        try:
            resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        except ValueError:
            return None
        layer_row = connection.execute(
            """
            SELECT id, map_id, name, image_name, background_color, canvas_width, canvas_height, sort_order, is_default, created_at, updated_at
            FROM map_layers
            WHERE id = ? AND map_id = ?
            """,
            (resolved_layer_id, resolved_map_id),
        ).fetchone()
    map_item = _map_row_to_dict(map_row)
    layer_item = _map_layer_row_to_dict(layer_row)
    if not map_item or not layer_item:
        return None

    image_name = str(layer_item["image_name"] or "")
    image_url = ""
    if image_name:
        image_path = MAP_LAYER_DIR / image_name
        if image_path.exists() and image_path.is_file():
            image_url = f"/api/map-image/{map_item['id']}?layer_id={layer_item['id']}&ts={layer_item['updated_at']}"

    return {
        "map_id": map_item["id"],
        "map_name": map_item["name"],
        "layer_id": str(layer_item["id"]),
        "layer_name": str(layer_item["name"]),
        "file_name": image_name,
        "background_color": str(layer_item["background_color"]),
        "canvas_width": int(layer_item["canvas_width"]),
        "canvas_height": int(layer_item["canvas_height"]),
        "updated_at": str(layer_item["updated_at"]),
        "url": image_url,
    }


def get_map_image_path(map_id: str | None = None, layer_id: str | None = None) -> Path | None:
    info = get_map_image_info(map_id, layer_id)
    if not info or not info["file_name"]:
        return None
    return MAP_LAYER_DIR / info["file_name"]


def _touch_map_drawings(connection: sqlite3.Connection) -> str:
    map_id = _resolve_map_id(connection)
    return _touch_map_scope(connection, MAP_DRAWINGS_UPDATED_AT_SETTING_KEY, map_id)


def _touch_map_pings(connection: sqlite3.Connection) -> str:
    map_id = _resolve_map_id(connection)
    return _touch_map_scope(connection, MAP_PINGS_UPDATED_AT_SETTING_KEY, map_id)


def _touch_map_pins(connection: sqlite3.Connection) -> str:
    map_id = _resolve_map_id(connection)
    return _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, map_id)


def _normalize_pin_target(
    connection: sqlite3.Connection,
    target_kind: str,
    target_id: str,
    current_map_id: str = "",
) -> tuple[str, str]:
    normalized_kind = str(target_kind or "").strip().lower()
    normalized_id = str(target_id or "").strip()
    if not normalized_kind or not normalized_id:
        return "", ""
    if normalized_kind == "map":
        row = connection.execute("SELECT id FROM maps WHERE id = ?", (normalized_id,)).fetchone()
        if not row:
            raise ValueError("Verlinkte Karte nicht gefunden.")
        if current_map_id and normalized_id == current_map_id:
            return "", ""
        return "map", normalized_id
    if normalized_kind == "battlemap":
        row = connection.execute("SELECT id FROM battlemaps WHERE id = ?", (normalized_id,)).fetchone()
        if not row:
            raise ValueError("Verlinkte Battlemap nicht gefunden.")
        return "battlemap", normalized_id
    raise ValueError("Ungueltiger Linktyp.")


def _touch_map_overlays(connection: sqlite3.Connection) -> str:
    map_id = _resolve_map_id(connection)
    return _touch_map_scope(connection, MAP_OVERLAYS_UPDATED_AT_SETTING_KEY, map_id)


def get_map_drawings(map_id: str | None = None, layer_id: str | None = None) -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        rows = connection.execute(
            """
            SELECT id, username, color, width, points_json, created_at
            FROM map_draw_strokes
            WHERE map_id = ? AND layer_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """
            ,
            (resolved_map_id, resolved_layer_id),
        ).fetchall()
        updated_at_row = connection.execute(
            "SELECT value FROM app_settings WHERE key = ?",
            (_scoped_map_setting_key(MAP_DRAWINGS_UPDATED_AT_SETTING_KEY, resolved_map_id),),
        ).fetchone()
        updated_at = updated_at_row[0] if updated_at_row else ""

    strokes = []
    for row in rows:
        strokes.append(
            {
                "id": row["id"],
                "username": row["username"],
                "color": row["color"],
                "width": row["width"],
                "points": json.loads(row["points_json"]),
                "created_at": row["created_at"],
            }
        )

    return {"updated_at": updated_at, "strokes": strokes, "map_id": resolved_map_id, "layer_id": resolved_layer_id}


def add_map_drawing_stroke(
    username: str,
    color: str,
    width: float,
    points: list[dict[str, float]],
    map_id: str | None = None,
    layer_id: str | None = None,
) -> dict[str, object]:
    init_storage()
    if not points:
        raise ValueError("Linie enthaelt keine Punkte.")

    sanitized_points = []
    for point in points:
        x = float(point.get("x", 0))
        y = float(point.get("y", 0))
        sanitized_points.append(
            {
                "x": min(max(x, 0.0), 1.0),
                "y": min(max(y, 0.0), 1.0),
            }
        )

    stroke_id = uuid4().hex
    created_at = datetime.now(timezone.utc).isoformat()
    normalized_color = str(color or "#ff6b6b").strip() or "#ff6b6b"
    normalized_width = min(max(float(width), 1.0), 24.0)

    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute(
            """
            INSERT INTO map_draw_strokes (id, map_id, layer_id, username, color, width, points_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                stroke_id,
                resolved_map_id,
                resolved_layer_id,
                username,
                normalized_color,
                normalized_width,
                json.dumps(sanitized_points, ensure_ascii=True),
                created_at,
            ),
        )
        updated_at = _touch_map_scope(connection, MAP_DRAWINGS_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()

    return {
          "id": stroke_id,
          "map_id": resolved_map_id,
          "layer_id": resolved_layer_id,
          "username": username,
        "color": normalized_color,
        "width": normalized_width,
        "points": sanitized_points,
        "created_at": created_at,
        "updated_at": updated_at,
    }


def clear_map_drawings(map_id: str | None = None, layer_id: str | None = None) -> None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute("DELETE FROM map_draw_strokes WHERE map_id = ? AND layer_id = ?", (resolved_map_id, resolved_layer_id))
        _touch_map_scope(connection, MAP_DRAWINGS_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()


def undo_last_map_drawing_stroke(username: str, map_id: str | None = None, layer_id: str | None = None) -> dict[str, object] | None:
    init_storage()
    normalized_username = str(username or "").strip()
    if not normalized_username:
        raise ValueError("Benutzername fehlt.")

    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        row = connection.execute(
            """
            SELECT id, username, color, width, points_json, created_at
            FROM map_draw_strokes
            WHERE map_id = ? AND layer_id = ? AND lower(username) = lower(?)
            ORDER BY datetime(created_at) DESC, created_at DESC
            LIMIT 1
            """,
            (resolved_map_id, resolved_layer_id, normalized_username),
        ).fetchone()
        if not row:
            return None

        connection.execute("DELETE FROM map_draw_strokes WHERE id = ?", (row[0],))
        updated_at = _touch_map_scope(connection, MAP_DRAWINGS_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()

    return {
        "id": row[0],
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
        "username": row[1],
        "color": row[2],
        "width": row[3],
        "points": json.loads(row[4]),
        "created_at": row[5],
        "updated_at": updated_at,
    }


def _purge_expired_map_pings(connection: sqlite3.Connection, map_id: str, layer_id: str | None = None) -> None:
    threshold = datetime.now(timezone.utc).timestamp() - MAP_PING_TTL_SECONDS
    threshold_iso = datetime.fromtimestamp(threshold, tz=timezone.utc).isoformat()
    if layer_id:
        connection.execute("DELETE FROM map_pings WHERE map_id = ? AND layer_id = ? AND created_at < ?", (map_id, layer_id, threshold_iso))
    else:
        connection.execute("DELETE FROM map_pings WHERE map_id = ? AND created_at < ?", (map_id, threshold_iso))


def get_map_pings(map_id: str | None = None, layer_id: str | None = None) -> dict[str, object]:
    init_storage()
    server_now = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        _purge_expired_map_pings(connection, resolved_map_id, resolved_layer_id)
        rows = connection.execute(
            """
            SELECT id, username, color, x, y, created_at
            FROM map_pings
            WHERE map_id = ? AND layer_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """
            ,
            (resolved_map_id, resolved_layer_id),
        ).fetchall()
        updated_at_row = connection.execute(
            "SELECT value FROM app_settings WHERE key = ?",
            (_scoped_map_setting_key(MAP_PINGS_UPDATED_AT_SETTING_KEY, resolved_map_id),),
        ).fetchone()
        updated_at = updated_at_row[0] if updated_at_row else ""
        connection.commit()

    pings = []
    for row in rows:
        pings.append(
            {
                "id": row["id"],
                "username": row["username"],
                "color": row["color"],
                "x": row["x"],
                "y": row["y"],
                "created_at": row["created_at"],
            }
        )

    return {
        "updated_at": updated_at,
        "pings": pings,
        "ttl_seconds": MAP_PING_TTL_SECONDS,
        "server_time": server_now,
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
    }


def add_map_ping(username: str, color: str, x: float, y: float, map_id: str | None = None, layer_id: str | None = None) -> dict[str, object]:
    init_storage()
    created_at = datetime.now(timezone.utc).isoformat()
    ping_id = uuid4().hex
    normalized_color = str(color or "#ff6b6b").strip() or "#ff6b6b"
    normalized_x = min(max(float(x), 0.0), 1.0)
    normalized_y = min(max(float(y), 0.0), 1.0)

    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        _purge_expired_map_pings(connection, resolved_map_id, resolved_layer_id)
        connection.execute(
            """
            INSERT INTO map_pings (id, map_id, layer_id, username, color, x, y, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (ping_id, resolved_map_id, resolved_layer_id, username, normalized_color, normalized_x, normalized_y, created_at),
        )
        updated_at = _touch_map_scope(connection, MAP_PINGS_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()

    return {
          "id": ping_id,
          "map_id": resolved_map_id,
          "layer_id": resolved_layer_id,
          "username": username,
        "color": normalized_color,
        "x": normalized_x,
        "y": normalized_y,
        "created_at": created_at,
        "updated_at": updated_at,
        "ttl_seconds": MAP_PING_TTL_SECONDS,
    }


def _can_move_map_pin(
    pin_row: sqlite3.Row | dict[str, object],
    *,
    current_user_id: str = "",
    current_username: str = "",
    current_role: str = "",
) -> bool:
    if current_role in {"spielleiter", "admin"}:
        return True
    if str(pin_row["pin_type"] if isinstance(pin_row, sqlite3.Row) else pin_row.get("pin_type") or "") != "token":
        return False
    normalized_current_username = str(current_username or "").strip().lower()
    assigned_user_id = str(pin_row["assigned_user_id"] if isinstance(pin_row, sqlite3.Row) else pin_row.get("assigned_user_id") or "")
    assigned_username = str(pin_row["assigned_username"] if isinstance(pin_row, sqlite3.Row) else pin_row.get("assigned_username") or "")
    if current_user_id and assigned_user_id and current_user_id == assigned_user_id:
        return True
    if normalized_current_username and assigned_username and normalized_current_username == assigned_username.lower():
        return True
    pin_name = str(pin_row["name"] if isinstance(pin_row, sqlite3.Row) else pin_row.get("name") or "").strip().lower()
    pin_owner = str(pin_row["username"] if isinstance(pin_row, sqlite3.Row) else pin_row.get("username") or "").strip().lower()
    return bool(normalized_current_username and (normalized_current_username == pin_name or normalized_current_username == pin_owner))


def _map_pin_payload(
    row: sqlite3.Row,
    resolved_map_id: str,
    *,
    current_user_id: str = "",
    current_username: str = "",
    current_role: str = "",
) -> dict[str, object]:
    image_name = row["image_name"] or ""
    sound_name = row["sound_name"] or ""
    image_version = row["updated_at"] or row["created_at"]
    target_kind = row["target_kind"] or ("map" if (row["target_map_id"] or "") else "")
    target_id = row["target_id"] or row["target_map_id"] or ""
    return {
        "id": row["id"],
        "map_id": resolved_map_id,
        "layer_id": row["layer_id"] if "layer_id" in row.keys() else "",
        "username": row["username"],
        "name": row["name"],
        "description": row["description"],
        "pin_type": row["pin_type"] or "pin",
        "assigned_user_id": row["assigned_user_id"] or "",
        "assigned_username": row["assigned_username"] or "",
        "sound_name": sound_name,
        "sound_title": row["sound_title"] or "",
        "sound_url": f"/api/map-pin-sound/{sound_name}?ts={image_version}" if sound_name else "",
        "target_kind": target_kind,
        "target_id": target_id,
        "target_map_id": target_id if target_kind == "map" else "",
        "group_id": row["group_id"] or "",
        "show_label": bool(row["show_label"]),
        "hidden_from_players": bool(row["hidden_from_players"]),
        "visibility_layer": _normalize_visibility_layer(row["visibility_layer"]),
        "vision_radius": _normalize_vision_radius(row["vision_radius"] if "vision_radius" in row.keys() else None),
        "image_name": image_name,
        "image_url": f"/api/map-pin-image/{image_name}?ts={image_version}" if image_name else "",
        "x": row["x"],
        "y": row["y"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"] or row["created_at"],
        "can_move": _can_move_map_pin(
            row,
            current_user_id=current_user_id,
            current_username=current_username,
            current_role=current_role,
        ),
    }


def get_map_pin(pin_id: str) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            """
            SELECT id, map_id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
            FROM map_pins
            WHERE id = ?
            """,
            (pin_id,),
        ).fetchone()
    if not row:
        return None
    return _map_pin_payload(row, row["map_id"])


def get_map_pins(
    map_id: str | None = None,
    include_hidden: bool = False,
    include_gm_layer: bool = False,
    layer_id: str | None = None,
    *,
    current_user_id: str = "",
    current_username: str = "",
    current_role: str = "",
) -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        if include_hidden:
            rows = connection.execute(
                """
                SELECT id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
                FROM map_pins
                WHERE map_id = ? AND layer_id = ?
                ORDER BY datetime(created_at) ASC, created_at ASC
                """,
                (resolved_map_id, resolved_layer_id),
            ).fetchall()
        else:
            rows = connection.execute(
                """
                SELECT id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
                FROM map_pins
                WHERE map_id = ? AND layer_id = ? AND visibility_layer = ?
                ORDER BY datetime(created_at) ASC, created_at ASC
                """,
                (resolved_map_id, resolved_layer_id, PUBLIC_LAYER),
            ).fetchall()
        updated_at_row = connection.execute(
            "SELECT value FROM app_settings WHERE key = ?",
            (_scoped_map_setting_key(MAP_PINS_UPDATED_AT_SETTING_KEY, resolved_map_id),),
        ).fetchone()
        updated_at = updated_at_row[0] if updated_at_row else ""

    pins = []
    for row in rows:
        payload = _map_pin_payload(
            row,
            resolved_map_id,
            current_user_id=current_user_id,
            current_username=current_username,
            current_role=current_role,
        )
        if payload["visibility_layer"] == GM_LAYER and not include_gm_layer:
            continue
        pins.append(payload)

    return {"updated_at": updated_at, "pins": pins, "map_id": resolved_map_id, "layer_id": resolved_layer_id}


def get_map_pin_group_members(group_id: str) -> list[dict[str, object]]:
    init_storage()
    normalized_group_id = str(group_id or "").strip()
    if not normalized_group_id:
        return []
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT id, map_id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
            FROM map_pins
            WHERE group_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """,
            (normalized_group_id,),
        ).fetchall()
    return [_map_pin_payload(row, row["map_id"]) for row in rows]


def get_map_overlays(map_id: str | None = None, layer_id: str | None = None, *, include_gm_layer: bool = False) -> dict[str, object]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        rows = connection.execute(
            """
            SELECT id, map_id, layer_id, username, image_name, x, y, width, height, visibility_layer, created_at, updated_at
            FROM map_overlays
            WHERE map_id = ? AND layer_id = ?
            ORDER BY datetime(created_at) ASC, created_at ASC
            """,
            (resolved_map_id, resolved_layer_id),
        ).fetchall()
        updated_at_row = connection.execute(
            "SELECT value FROM app_settings WHERE key = ?",
            (_scoped_map_setting_key(MAP_OVERLAYS_UPDATED_AT_SETTING_KEY, resolved_map_id),),
        ).fetchone()
        updated_at = updated_at_row[0] if updated_at_row else ""

    overlays = []
    for row in rows:
        visibility_layer = _normalize_visibility_layer(row["visibility_layer"])
        if visibility_layer == GM_LAYER and not include_gm_layer:
            continue
        overlays.append(
                {
                    "id": row["id"],
                    "map_id": row["map_id"],
                    "layer_id": row["layer_id"],
                    "username": row["username"],
                "image_name": row["image_name"],
                "image_url": f"/api/map-overlay-image/{row['image_name']}?ts={row['updated_at']}",
                "x": row["x"],
                "y": row["y"],
                "width": row["width"],
                "height": row["height"],
                "visibility_layer": visibility_layer,
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            }
        )

    return {"updated_at": updated_at, "overlays": overlays, "map_id": resolved_map_id, "layer_id": resolved_layer_id}


def delete_map_pin(pin_id: str) -> bool:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row = connection.execute(
            "SELECT map_id, image_name, sound_name, target_map_id, target_kind, target_id, group_id FROM map_pins WHERE id = ?",
            (pin_id,),
        ).fetchone()
        if not row:
            return False

        map_id = row[0] or ""
        image_name = row[1] or ""
        sound_name = row[2] or ""
        group_id = row[6] or ""
        connection.execute("DELETE FROM map_pins WHERE id = ?", (pin_id,))
        if group_id:
            _cleanup_map_pin_group(connection, group_id)
        if map_id:
            _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, map_id)
        connection.commit()

    if image_name:
        image_path = MAP_PIN_DIR / image_name
        if image_path.exists() and image_path.is_file():
            image_path.unlink()
    if sound_name:
        sound_path = MAP_SOUND_DIR / sound_name
        if sound_path.exists() and sound_path.is_file():
            sound_path.unlink()
    return True


def _cleanup_map_pin_group(connection: sqlite3.Connection, group_id: str) -> None:
    normalized_group_id = str(group_id or "").strip()
    if not normalized_group_id:
        return
    remaining = connection.execute(
        "SELECT id FROM map_pins WHERE group_id = ? ORDER BY datetime(created_at) ASC, created_at ASC",
        (normalized_group_id,),
    ).fetchall()
    if len(remaining) <= 1:
        connection.execute(
            "UPDATE map_pins SET group_id = '' WHERE group_id = ?",
            (normalized_group_id,),
        )


def update_map_pin_position(pin_id: str, x: float, y: float) -> dict[str, object] | None:
    init_storage()
    normalized_x = min(max(float(x), 0.0), 1.0)
    normalized_y = min(max(float(y), 0.0), 1.0)
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        existing = connection.execute(
            """
            SELECT id, map_id, layer_id, pin_type, group_id, visibility_layer, vision_radius, x, y
            FROM map_pins
            WHERE id = ?
            """,
            (pin_id,),
        ).fetchone()
        if not existing:
            return None
        map_id = existing["map_id"]
        layer_id = existing["layer_id"] or ""
        row_updated_at = datetime.now(timezone.utc).isoformat()
        moved_token_rows: list[sqlite3.Row] = []
        if (existing["pin_type"] or "pin") == "token" and (existing["group_id"] or ""):
            delta_x = normalized_x - float(existing["x"])
            delta_y = normalized_y - float(existing["y"])
            group_rows = connection.execute(
                "SELECT id, map_id, layer_id, pin_type, visibility_layer, vision_radius, x, y FROM map_pins WHERE group_id = ?",
                (existing["group_id"],),
            ).fetchall()
            for group_row in group_rows:
                next_x = min(max(float(group_row["x"]) + delta_x, 0.0), 1.0)
                next_y = min(max(float(group_row["y"]) + delta_y, 0.0), 1.0)
                connection.execute(
                    "UPDATE map_pins SET x = ?, y = ?, updated_at = ? WHERE id = ?",
                    (next_x, next_y, row_updated_at, group_row["id"]),
                )
                moved_token_rows.append(
                    {
                        "id": group_row["id"],
                        "map_id": group_row["map_id"],
                        "layer_id": group_row["layer_id"],
                        "pin_type": group_row["pin_type"],
                        "visibility_layer": group_row["visibility_layer"],
                        "vision_radius": group_row["vision_radius"],
                        "x": next_x,
                        "y": next_y,
                    }
                )
        else:
            connection.execute(
                "UPDATE map_pins SET x = ?, y = ?, updated_at = ? WHERE id = ?",
                (normalized_x, normalized_y, row_updated_at, pin_id),
            )
            moved_token_rows.append(
                {
                    "id": existing["id"],
                    "map_id": map_id,
                    "layer_id": layer_id,
                    "pin_type": existing["pin_type"],
                    "visibility_layer": existing["visibility_layer"],
                    "vision_radius": existing["vision_radius"],
                    "x": normalized_x,
                    "y": normalized_y,
                }
            )
        _reveal_map_fog_for_tokens(connection, map_id, layer_id, moved_token_rows)
        updated_at = _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, map_id)
        row = connection.execute(
            """
            SELECT id, map_id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
            FROM map_pins
            WHERE id = ?
            """,
            (pin_id,),
        ).fetchone()
        connection.commit()

    payload = _map_pin_payload(row, row["map_id"])
    payload["updated_at"] = row["updated_at"] or updated_at or row["created_at"]
    return payload


def update_map_pin_visibility_layer(pin_id: str, visibility_layer: str) -> dict[str, object] | None:
    init_storage()
    normalized_visibility_layer = _normalize_visibility_layer(visibility_layer)
    updated_at = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        existing = connection.execute(
            "SELECT map_id, pin_type, created_at FROM map_pins WHERE id = ?",
            (pin_id,),
        ).fetchone()
        if not existing:
            return None
        connection.execute(
            "UPDATE map_pins SET hidden_from_players = ?, visibility_layer = ?, updated_at = ? WHERE id = ?",
            (
                1 if normalized_visibility_layer == GM_LAYER else 0,
                normalized_visibility_layer,
                updated_at,
                pin_id,
            ),
        )
        if (existing["pin_type"] or "pin") == "token":
            row_for_reveal = connection.execute(
                """
                SELECT id, map_id, layer_id, pin_type, visibility_layer, vision_radius, x, y
                FROM map_pins
                WHERE id = ?
                """,
                (pin_id,),
            ).fetchone()
            if row_for_reveal:
                _reveal_map_fog_for_tokens(
                    connection,
                    row_for_reveal["map_id"] or "",
                    row_for_reveal["layer_id"] or "",
                    [row_for_reveal],
                )
        list_updated_at = _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, existing["map_id"])
        row = connection.execute(
            """
            SELECT id, map_id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
            FROM map_pins
            WHERE id = ?
            """,
            (pin_id,),
        ).fetchone()
        connection.commit()
    payload = _map_pin_payload(row, row["map_id"])
    payload["updated_at"] = list_updated_at or row["updated_at"] or row["created_at"]
    return payload


async def update_map_pin_details(
    pin_id: str,
    name: str,
    description: str,
    show_label: bool,
    hidden_from_players: bool,
    visibility_layer: str | None = None,
    pin_type: str = "pin",
    assigned_user_id: str = "",
    assigned_username: str = "",
    target_kind: str = "",
    target_id: str = "",
    vision_radius: float | None = None,
    image_upload: UploadFile | None = None,
    sound_upload: UploadFile | None = None,
) -> dict[str, object] | None:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Pin-Name darf nicht leer sein.")
    normalized_pin_type = str(pin_type or "pin").strip().lower()
    if normalized_pin_type not in {"pin", "token", "sound_token"}:
        raise ValueError("Ungueltiger Markertyp.")

    updated_at = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        existing = connection.execute(
            "SELECT map_id, layer_id, image_name, sound_name, sound_title, created_at, group_id, vision_radius FROM map_pins WHERE id = ?",
            (pin_id,),
        ).fetchone()
        if not existing:
            return None

        normalized_target_kind, normalized_target_id = _normalize_pin_target(connection, target_kind, target_id, existing["map_id"])
        normalized_visibility_layer = _normalize_visibility_layer(
            visibility_layer if visibility_layer is not None else (GM_LAYER if hidden_from_players or normalized_pin_type == "sound_token" else PUBLIC_LAYER)
        )
        normalized_vision_radius = _normalize_vision_radius(
            vision_radius if normalized_pin_type == "token" else existing["vision_radius"]
        ) if normalized_pin_type == "token" else 0.0
        image_name = existing["image_name"] or ""
        sound_name = existing["sound_name"] or ""
        sound_title = existing["sound_title"] or ""
        if image_upload and image_upload.filename:
            original_name = _sanitize_filename(image_upload.filename)
            extension = Path(original_name).suffix.lower() or ".bin"
            next_image_name = f"{pin_id}{extension}"
            target_path = MAP_PIN_DIR / next_image_name
            if image_name and image_name != next_image_name:
                old_path = MAP_PIN_DIR / image_name
                if old_path.exists() and old_path.is_file():
                    old_path.unlink()
            with target_path.open("wb") as handle:
                shutil.copyfileobj(image_upload.file, handle)
            image_name = next_image_name
        if normalized_pin_type == "sound_token":
            if sound_upload and sound_upload.filename:
                original_sound_name = _sanitize_filename(sound_upload.filename)
                extension = Path(original_sound_name).suffix.lower() or ".bin"
                if extension not in ALLOWED_MUSIC_EXTENSIONS:
                    raise ValueError("Erlaubt sind MP3, OGG, WAV, M4A, AAC, MP4 oder WEBM.")
                next_sound_name = f"{pin_id}{extension}"
                target_sound_path = MAP_SOUND_DIR / next_sound_name
                if sound_name and sound_name != next_sound_name:
                    old_sound_path = MAP_SOUND_DIR / sound_name
                    if old_sound_path.exists() and old_sound_path.is_file():
                        old_sound_path.unlink()
                with target_sound_path.open("wb") as handle:
                    shutil.copyfileobj(sound_upload.file, handle)
                sound_name = next_sound_name
                sound_title = Path(original_sound_name).stem
            if not sound_name:
                raise ValueError("Sound-Token braucht eine Audiodatei.")
        else:
            if sound_name:
                old_sound_path = MAP_SOUND_DIR / sound_name
                if old_sound_path.exists() and old_sound_path.is_file():
                    old_sound_path.unlink()
            sound_name = ""
            sound_title = ""

        connection.execute(
            """
            UPDATE map_pins
            SET name = ?, description = ?, image_name = ?, pin_type = ?, assigned_user_id = ?, assigned_username = ?, sound_name = ?, sound_title = ?, target_map_id = ?, target_kind = ?, target_id = ?, group_id = ?, show_label = ?, hidden_from_players = ?, visibility_layer = ?, vision_radius = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                normalized_name,
                description.strip(),
                image_name or None,
                normalized_pin_type,
                assigned_user_id.strip() if normalized_pin_type == "token" else "",
                assigned_username.strip() if normalized_pin_type == "token" else "",
                sound_name,
                sound_title,
                normalized_target_id if (normalized_pin_type != "sound_token" and normalized_target_kind == "map") else "",
                normalized_target_kind if normalized_pin_type != "sound_token" else "",
                normalized_target_id if normalized_pin_type != "sound_token" else "",
                existing["group_id"] if normalized_pin_type == "token" else "",
                1 if show_label else 0,
                1 if normalized_visibility_layer == GM_LAYER else 0,
                normalized_visibility_layer,
                normalized_vision_radius,
                updated_at,
                pin_id,
            ),
        )
        map_id = existing["map_id"]
        if normalized_pin_type != "token" and existing["group_id"]:
            _cleanup_map_pin_group(connection, existing["group_id"])
        _reveal_map_fog_for_tokens(
            connection,
            existing["map_id"] or "",
            existing["layer_id"] or "",
            [
                {
                    "id": pin_id,
                    "pin_type": normalized_pin_type,
                    "visibility_layer": normalized_visibility_layer,
                    "vision_radius": normalized_vision_radius,
                    "x": existing["x"],
                    "y": existing["y"],
                }
            ],
        )
        list_updated_at = _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, map_id)
        row = connection.execute(
            """
            SELECT id, map_id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
            FROM map_pins
            WHERE id = ?
            """,
            (pin_id,),
        ).fetchone()
        connection.commit()

    payload = _map_pin_payload(row, row["map_id"])
    payload["updated_at"] = list_updated_at or row["updated_at"] or row["created_at"]
    return payload


def get_map_pin_image_path(image_name: str) -> Path | None:
    init_storage()
    normalized = Path(image_name or "").name
    if not normalized:
        return None
    image_path = MAP_PIN_DIR / normalized
    if not image_path.exists() or not image_path.is_file():
        return None
    return image_path


def get_map_pin_sound_path(sound_name: str) -> Path | None:
    init_storage()
    normalized = Path(sound_name or "").name
    if not normalized:
        return None
    sound_path = MAP_SOUND_DIR / normalized
    if not sound_path.exists() or not sound_path.is_file():
        return None
    return sound_path


def get_map_overlay_image_path(image_name: str) -> Path | None:
    init_storage()
    normalized = Path(image_name or "").name
    if not normalized:
        return None
    image_path = MAP_OVERLAY_DIR / normalized
    if not image_path.exists() or not image_path.is_file():
        return None
    return image_path


async def save_map_pin(
    username: str,
    name: str,
    description: str,
    x: float,
    y: float,
    image_upload: UploadFile | None = None,
    show_label: bool = True,
    hidden_from_players: bool = False,
    visibility_layer: str | None = None,
    pin_type: str = "pin",
    assigned_user_id: str = "",
    assigned_username: str = "",
    target_kind: str = "",
    target_id: str = "",
    sound_upload: UploadFile | None = None,
    map_id: str | None = None,
    layer_id: str | None = None,
    vision_radius: float | None = None,
) -> dict[str, object]:
    init_storage()
    normalized_name = name.strip()
    if not normalized_name:
        raise ValueError("Pin-Name darf nicht leer sein.")
    normalized_pin_type = str(pin_type or "pin").strip().lower()
    if normalized_pin_type not in {"pin", "token", "sound_token"}:
        raise ValueError("Ungueltiger Markertyp.")

    pin_id = uuid4().hex
    created_at = datetime.now(timezone.utc).isoformat()
    image_name = ""
    sound_name = ""
    sound_title = ""

    if image_upload and image_upload.filename:
        original_name = _sanitize_filename(image_upload.filename)
        extension = Path(original_name).suffix.lower() or ".bin"
        image_name = f"{pin_id}{extension}"
        target_path = MAP_PIN_DIR / image_name
        with target_path.open("wb") as handle:
            shutil.copyfileobj(image_upload.file, handle)
    if normalized_pin_type == "sound_token":
        if not sound_upload or not sound_upload.filename:
            raise ValueError("Sound-Token braucht eine Audiodatei.")
        original_sound_name = _sanitize_filename(sound_upload.filename)
        extension = Path(original_sound_name).suffix.lower() or ".bin"
        if extension not in ALLOWED_MUSIC_EXTENSIONS:
            raise ValueError("Erlaubt sind MP3, OGG, WAV, M4A, AAC, MP4 oder WEBM.")
        sound_name = f"{pin_id}{extension}"
        sound_title = Path(original_sound_name).stem
        target_sound_path = MAP_SOUND_DIR / sound_name
        with target_sound_path.open("wb") as handle:
            shutil.copyfileobj(sound_upload.file, handle)

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        normalized_target_kind, normalized_target_id = _normalize_pin_target(connection, target_kind, target_id, resolved_map_id)
        normalized_visibility_layer = _normalize_visibility_layer(
            visibility_layer if visibility_layer is not None else (GM_LAYER if hidden_from_players or normalized_pin_type == "sound_token" else PUBLIC_LAYER)
        )
        normalized_vision_radius = _normalize_vision_radius(vision_radius) if normalized_pin_type == "token" else 0.0
        connection.execute(
            """
            INSERT INTO map_pins (id, map_id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                pin_id,
                resolved_map_id,
                resolved_layer_id,
                username,
                normalized_name,
                description.strip(),
                image_name or None,
                normalized_pin_type,
                assigned_user_id.strip() if normalized_pin_type == "token" else "",
                assigned_username.strip() if normalized_pin_type == "token" else "",
                sound_name,
                sound_title,
                normalized_target_id if (normalized_pin_type != "sound_token" and normalized_target_kind == "map") else "",
                normalized_target_kind if normalized_pin_type != "sound_token" else "",
                normalized_target_id if normalized_pin_type != "sound_token" else "",
                "",
                1 if show_label else 0,
                1 if normalized_visibility_layer == GM_LAYER else 0,
                normalized_visibility_layer,
                normalized_vision_radius,
                min(max(float(x), 0.0), 1.0),
                min(max(float(y), 0.0), 1.0),
                created_at,
                created_at,
            ),
        )
        _reveal_map_fog_for_tokens(
            connection,
            resolved_map_id,
            resolved_layer_id,
            [
                {
                    "id": pin_id,
                    "pin_type": normalized_pin_type,
                    "visibility_layer": normalized_visibility_layer,
                    "vision_radius": normalized_vision_radius,
                    "x": min(max(float(x), 0.0), 1.0),
                    "y": min(max(float(y), 0.0), 1.0),
                }
            ],
        )
        updated_at = _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, resolved_map_id)
        row = connection.execute(
            """
            SELECT id, map_id, layer_id, username, name, description, image_name, pin_type, assigned_user_id, assigned_username, sound_name, sound_title, target_map_id, target_kind, target_id, group_id, show_label, hidden_from_players, visibility_layer, vision_radius, x, y, created_at, updated_at
            FROM map_pins
            WHERE id = ?
            """,
            (pin_id,),
        ).fetchone()
        connection.commit()

    payload = _map_pin_payload(row, resolved_map_id)
    payload["updated_at"] = updated_at
    return payload


def group_map_tokens(token_ids: list[str]) -> dict[str, object]:
    init_storage()
    normalized_ids = [str(token_id or "").strip() for token_id in token_ids if str(token_id or "").strip()]
    unique_ids = list(dict.fromkeys(normalized_ids))
    if len(unique_ids) < 2:
        raise ValueError("Mindestens zwei Tokens werden zum Gruppieren benoetigt.")

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        placeholders = ", ".join("?" for _ in unique_ids)
        rows = connection.execute(
            f"""
            SELECT id, map_id, pin_type, group_id
            FROM map_pins
            WHERE id IN ({placeholders})
            """,
            tuple(unique_ids),
        ).fetchall()
        if len(rows) != len(unique_ids):
            raise ValueError("Mindestens ein Token wurde nicht gefunden.")
        if any((row["pin_type"] or "pin") != "token" for row in rows):
            raise ValueError("Es koennen nur Tokens gruppiert werden.")
        map_ids = {row["map_id"] or "" for row in rows}
        if len(map_ids) != 1:
            raise ValueError("Es koennen nur Tokens derselben Karte gruppiert werden.")

        group_id = uuid4().hex
        row_updated_at = datetime.now(timezone.utc).isoformat()
        connection.execute(
            f"""
            UPDATE map_pins
            SET group_id = ?, updated_at = ?
            WHERE id IN ({placeholders})
            """,
            (group_id, row_updated_at, *unique_ids),
        )
        for previous_group_id in {row["group_id"] or "" for row in rows if row["group_id"]}:
            if previous_group_id != group_id:
                _cleanup_map_pin_group(connection, previous_group_id)
        map_id = rows[0]["map_id"] or ""
        updated_at = _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, map_id)
        connection.commit()
    return {"group_id": group_id, "map_id": map_id, "updated_at": updated_at or row_updated_at}


def ungroup_map_tokens(token_ids: list[str]) -> dict[str, object]:
    init_storage()
    normalized_ids = [str(token_id or "").strip() for token_id in token_ids if str(token_id or "").strip()]
    unique_ids = list(dict.fromkeys(normalized_ids))
    if not unique_ids:
        raise ValueError("Keine Tokens zum Trennen uebergeben.")

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        placeholders = ", ".join("?" for _ in unique_ids)
        rows = connection.execute(
            f"""
            SELECT id, map_id, group_id
            FROM map_pins
            WHERE id IN ({placeholders})
            """,
            tuple(unique_ids),
        ).fetchall()
        if not rows:
            raise ValueError("Keine passenden Tokens gefunden.")
        map_ids = {row["map_id"] or "" for row in rows}
        if len(map_ids) != 1:
            raise ValueError("Es koennen nur Tokens derselben Karte getrennt werden.")
        affected_group_ids = {row["group_id"] or "" for row in rows if row["group_id"]}
        row_updated_at = datetime.now(timezone.utc).isoformat()
        connection.execute(
            f"""
            UPDATE map_pins
            SET group_id = '', updated_at = ?
            WHERE id IN ({placeholders})
            """,
            (row_updated_at, *unique_ids),
        )
        for affected_group_id in affected_group_ids:
            _cleanup_map_pin_group(connection, affected_group_id)
        map_id = rows[0]["map_id"] or ""
        updated_at = _touch_map_scope(connection, MAP_PINS_UPDATED_AT_SETTING_KEY, map_id)
        connection.commit()
    return {"map_id": map_id, "updated_at": updated_at or row_updated_at}


async def save_map_overlay(
    username: str,
    upload: UploadFile,
    x: float,
    y: float,
    width: float,
    height: float,
    visibility_layer: str = PUBLIC_LAYER,
    map_id: str | None = None,
    layer_id: str | None = None,
) -> dict[str, object]:
    init_storage()
    if not upload or not upload.filename:
        raise ValueError("Overlay-Bild fehlt.")

    overlay_id = uuid4().hex
    created_at = datetime.now(timezone.utc).isoformat()
    normalized_x = min(max(float(x), 0.0), 1.0)
    normalized_y = min(max(float(y), 0.0), 1.0)
    normalized_width = min(max(float(width), 0.04), 1.0)
    normalized_height = min(max(float(height), 0.04), 1.0)
    normalized_layer = _normalize_visibility_layer(visibility_layer)
    original_name = _sanitize_filename(upload.filename)
    extension = Path(original_name).suffix.lower() or ".bin"
    image_name = f"{overlay_id}{extension}"
    target_path = MAP_OVERLAY_DIR / image_name

    with target_path.open("wb") as handle:
        shutil.copyfileobj(upload.file, handle)

    with sqlite3.connect(DB_PATH) as connection:
        resolved_map_id = _resolve_map_id(connection, map_id)
        resolved_layer_id = _resolve_map_layer_id(connection, resolved_map_id, layer_id)
        connection.execute(
            """
            INSERT INTO map_overlays (id, map_id, layer_id, username, image_name, x, y, width, height, visibility_layer, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                overlay_id,
                resolved_map_id,
                resolved_layer_id,
                username,
                image_name,
                normalized_x,
                normalized_y,
                normalized_width,
                normalized_height,
                normalized_layer,
                created_at,
                created_at,
            ),
        )
        list_updated_at = _touch_map_scope(connection, MAP_OVERLAYS_UPDATED_AT_SETTING_KEY, resolved_map_id)
        connection.commit()

    return {
        "id": overlay_id,
        "map_id": resolved_map_id,
        "layer_id": resolved_layer_id,
        "username": username,
        "image_name": image_name,
        "image_url": f"/api/map-overlay-image/{image_name}?ts={created_at}",
        "x": normalized_x,
        "y": normalized_y,
        "width": normalized_width,
        "height": normalized_height,
        "visibility_layer": normalized_layer,
        "created_at": created_at,
        "updated_at": created_at,
        "list_updated_at": list_updated_at,
    }


def update_map_overlay_geometry(
    overlay_id: str,
    x: float,
    y: float,
    width: float,
    height: float,
) -> dict[str, object] | None:
    init_storage()
    normalized_x = min(max(float(x), 0.0), 1.0)
    normalized_y = min(max(float(y), 0.0), 1.0)
    normalized_width = min(max(float(width), 0.04), 1.0)
    normalized_height = min(max(float(height), 0.04), 1.0)
    updated_at = datetime.now(timezone.utc).isoformat()

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        connection.execute(
            """
            UPDATE map_overlays
            SET x = ?, y = ?, width = ?, height = ?, updated_at = ?
            WHERE id = ?
            """,
            (normalized_x, normalized_y, normalized_width, normalized_height, updated_at, overlay_id),
        )
        if connection.total_changes == 0:
            return None
        row = connection.execute(
            """
            SELECT id, map_id, layer_id, username, image_name, x, y, width, height, visibility_layer, created_at, updated_at
            FROM map_overlays
            WHERE id = ?
            """,
            (overlay_id,),
        ).fetchone()
        list_updated_at = _touch_map_scope(connection, MAP_OVERLAYS_UPDATED_AT_SETTING_KEY, row["map_id"])
        connection.commit()

    return {
        "id": row["id"],
        "map_id": row["map_id"],
        "layer_id": row["layer_id"],
        "username": row["username"],
        "image_name": row["image_name"],
        "image_url": f"/api/map-overlay-image/{row['image_name']}?ts={row['updated_at']}",
        "x": row["x"],
        "y": row["y"],
        "width": row["width"],
        "height": row["height"],
        "visibility_layer": _normalize_visibility_layer(row["visibility_layer"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "list_updated_at": list_updated_at,
    }


def update_map_overlay_visibility_layer(overlay_id: str, visibility_layer: str) -> dict[str, object] | None:
    init_storage()
    normalized_layer = _normalize_visibility_layer(visibility_layer)
    updated_at = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        connection.execute(
            "UPDATE map_overlays SET visibility_layer = ?, updated_at = ? WHERE id = ?",
            (normalized_layer, updated_at, overlay_id),
        )
        if connection.total_changes == 0:
            return None
        row = connection.execute(
            """
            SELECT id, map_id, layer_id, username, image_name, x, y, width, height, visibility_layer, created_at, updated_at
            FROM map_overlays
            WHERE id = ?
            """,
            (overlay_id,),
        ).fetchone()
        list_updated_at = _touch_map_scope(connection, MAP_OVERLAYS_UPDATED_AT_SETTING_KEY, row["map_id"])
        connection.commit()
    return {
        "id": row["id"],
        "map_id": row["map_id"],
        "layer_id": row["layer_id"],
        "username": row["username"],
        "image_name": row["image_name"],
        "image_url": f"/api/map-overlay-image/{row['image_name']}?ts={row['updated_at']}",
        "x": row["x"],
        "y": row["y"],
        "width": row["width"],
        "height": row["height"],
        "visibility_layer": _normalize_visibility_layer(row["visibility_layer"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "list_updated_at": list_updated_at,
    }


def delete_map_overlay(overlay_id: str) -> bool:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row = connection.execute(
            "SELECT map_id, image_name FROM map_overlays WHERE id = ?",
            (overlay_id,),
        ).fetchone()
        if not row:
            return False

        map_id = row[0] or ""
        image_name = row[1] or ""
        connection.execute("DELETE FROM map_overlays WHERE id = ?", (overlay_id,))
        if map_id:
            _touch_map_scope(connection, MAP_OVERLAYS_UPDATED_AT_SETTING_KEY, map_id)
        connection.commit()

    if image_name:
        image_path = MAP_OVERLAY_DIR / image_name
        if image_path.exists() and image_path.is_file():
            image_path.unlink()
    return True


def _upsert_setting(connection: sqlite3.Connection, key: str, value: str) -> None:
    connection.execute(
        """
        INSERT INTO app_settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """,
        (key, value),
    )


def _hash_password(password: str) -> str:
    salt = secrets.token_bytes(AUTH_SALT_BYTES)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, AUTH_ITERATIONS)
    return f"{salt.hex()}:{digest.hex()}"


def _verify_password(password: str, password_hash: str) -> bool:
    salt_hex, digest_hex = password_hash.split(":", maxsplit=1)
    salt = bytes.fromhex(salt_hex)
    expected = bytes.fromhex(digest_hex)
    actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, AUTH_ITERATIONS)
    return secrets.compare_digest(actual, expected)


def create_user(username: str, password: str) -> dict[str, str]:
    init_storage()
    normalized = username.strip()
    if not normalized:
        raise ValueError("Login-Name darf nicht leer sein.")

    user_id = uuid4().hex
    created_at = datetime.now(timezone.utc).isoformat()
    password_hash = _hash_password(password)

    try:
        with sqlite3.connect(DB_PATH) as connection:
            existing = connection.execute(
                "SELECT 1 FROM users WHERE username = ? COLLATE NOCASE",
                (normalized,),
            ).fetchone()
            if existing:
                raise ValueError("Login-Name existiert bereits.")
            connection.execute(
                """
                INSERT INTO users (id, username, role, password_hash, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (user_id, normalized, DEFAULT_USER_ROLE, password_hash, created_at),
            )
            connection.commit()
    except sqlite3.IntegrityError as exc:
        raise ValueError("Login-Name existiert bereits.") from exc

    return {
        "id": user_id,
        "username": normalized,
        "role": DEFAULT_USER_ROLE,
        "created_at": created_at,
    }


def authenticate_user(username: str, password: str) -> dict[str, str] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        row = connection.execute(
            "SELECT id, username, role, password_hash FROM users WHERE username = ? COLLATE NOCASE",
            (username.strip(),),
        ).fetchone()
    if not row:
        return None
    if not _verify_password(password, row[3]):
        return None
    return {"id": row[0], "username": row[1], "role": row[2]}


def create_user_session(user_id: str) -> str:
    init_storage()
    token = secrets.token_urlsafe(32)
    created_at = datetime.now(timezone.utc).isoformat()
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            INSERT INTO user_sessions (token, user_id, created_at)
            VALUES (?, ?, ?)
            """,
            (token, user_id, created_at),
        )
        connection.commit()
    return token


def get_user_by_session_token(token: str) -> dict[str, str] | None:
    init_storage()
    if not token:
        return None
    with sqlite3.connect(DB_PATH) as connection:
        row = connection.execute(
            """
            SELECT u.id, u.username, u.role
            FROM user_sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = ?
            """,
            (token,),
        ).fetchone()
    if not row:
        return None
    return {"id": row[0], "username": row[1], "role": row[2]}


def delete_user_session(token: str) -> None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("DELETE FROM user_sessions WHERE token = ?", (token,))
        connection.commit()


def list_users() -> list[dict[str, str]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT id, username, role, created_at
            FROM users
            ORDER BY username COLLATE NOCASE
            """
        ).fetchall()
    return [dict(row) for row in rows]


def update_user_role(user_id: str, role: str) -> dict[str, str]:
    init_storage()
    normalized_role = role.strip().lower()
    if normalized_role not in ALLOWED_USER_ROLES:
        raise ValueError("Ungueltige Rolle.")

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        connection.execute(
            "UPDATE users SET role = ? WHERE id = ?",
            (normalized_role, user_id),
        )
        if connection.total_changes == 0:
            raise ValueError("Benutzer nicht gefunden.")
        row = connection.execute(
            "SELECT id, username, role, created_at FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()
        connection.commit()

    return dict(row)


def _sanitize_filename(filename: str) -> str:
    cleaned = Path(filename or "upload.bin").name
    return cleaned or "upload.bin"


def _clear_existing_map_images() -> None:
    for path in MAP_DIR.iterdir():
        if path.is_file():
            path.unlink()


def _file_checksum(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _normalize_element_content(content: str) -> str:
    return re.sub(r"\s+", " ", str(content or "")).strip()


def _fold_text(text: str) -> str:
    normalized = str(text or "")
    for source, target in (("Ä", "Ae"), ("Ö", "Oe"), ("Ü", "Ue"), ("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        normalized = normalized.replace(source, target)
    normalized = unicodedata.normalize("NFKD", normalized)
    normalized = "".join(char for char in normalized if not unicodedata.combining(char))
    return normalized.lower()


def _validation_status_for_content(content: str) -> str:
    normalized = _normalize_element_content(content)
    if not normalized:
        return VALIDATION_STATUS_EMPTY
    if len(normalized) == 1 and not normalized.isalnum():
        return VALIDATION_STATUS_REVIEW
    return VALIDATION_STATUS_VALID


def _safe_section_path(section_path: list[str]) -> list[str]:
    return [str(part).strip() for part in section_path if str(part).strip()]


def _section_label_from_path(section_path: list[str]) -> str:
    parts = _safe_section_path(section_path)
    return " > ".join(parts) if parts else "Dokument"


def _read_plain_text(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="latin-1")
        except UnicodeDecodeError:
            return None


def _extract_markdown_title(text: str, fallback: str) -> str:
    for raw_line in text.splitlines():
        line = raw_line.strip()
        match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if match:
            return match.group(2).strip()
    return fallback


def _slugify(value: str) -> str:
    normalized = re.sub(r"[^a-zA-Z0-9]+", "-", str(value or "").strip().lower()).strip("-")
    return normalized or "seite"


def _document_file_path(document_row: sqlite3.Row | tuple | dict[str, object]) -> Path | None:
    if isinstance(document_row, sqlite3.Row):
        source_type = str(document_row["source_type"])
        source_path = str(document_row["source_path"] or "")
        stored_name = str(document_row["stored_name"] or "")
    else:
        source_type = str(document_row.get("source_type") or "")
        source_path = str(document_row.get("source_path") or "")
        stored_name = str(document_row.get("stored_name") or "")
    if source_type == "upload" and stored_name:
        return UPLOAD_DIR / stored_name
    if source_path:
        return Path(source_path)
    return None


def _extract_wiki_links(markdown_content: str, title_map: dict[str, str], source_slug: str) -> list[dict[str, str]]:
    links: list[dict[str, str]] = []
    seen: set[tuple[str, str, str]] = set()

    for match in re.finditer(r"\[\[([^\]]+)\]\]", markdown_content):
        label = _normalize_element_content(match.group(1))
        if not label:
            continue
        target_slug = title_map.get(label.lower(), _slugify(label))
        if target_slug == source_slug:
            continue
        key = (target_slug, label, WIKI_SOURCE_KIND_EXPLICIT)
        if key in seen:
            continue
        seen.add(key)
        links.append({"target_slug": target_slug, "link_label": label, "link_kind": WIKI_SOURCE_KIND_EXPLICIT})

    for match in re.finditer(r"\[([^\]]+)\]\(([^)]+)\)", markdown_content):
        label = _normalize_element_content(match.group(1))
        target = match.group(2).strip()
        if not label or not target or "://" in target or target.startswith("#"):
            continue
        target_path = Path(target.split("#", 1)[0])
        if target_path.suffix.lower() != MARKDOWN_EXTENSION:
            continue
        target_name = _normalize_element_content(target_path.stem.replace("-", " ").replace("_", " "))
        target_slug = title_map.get(target_name.lower(), _slugify(target_path.stem))
        if target_slug == source_slug:
            continue
        key = (target_slug, label, WIKI_SOURCE_KIND_EXPLICIT)
        if key in seen:
            continue
        seen.add(key)
        links.append({"target_slug": target_slug, "link_label": label, "link_kind": WIKI_SOURCE_KIND_EXPLICIT})

    normalized_text = markdown_content.lower()
    for lower_title, target_slug in title_map.items():
        if target_slug == source_slug or len(lower_title) < 3:
            continue
        pattern = rf"(?<!\w){re.escape(lower_title)}(?!\w)"
        if not re.search(pattern, normalized_text, re.IGNORECASE):
            continue
        key = (target_slug, lower_title, WIKI_SOURCE_KIND_MENTION)
        if key in seen:
            continue
        seen.add(key)
        links.append({"target_slug": target_slug, "link_label": lower_title, "link_kind": WIKI_SOURCE_KIND_MENTION})
    return links


def _rebuild_wiki_pages(connection: sqlite3.Connection) -> None:
    connection.row_factory = sqlite3.Row
    document_rows = connection.execute(
        """
        SELECT id, source_type, source_path, stored_name, display_name, extension, updated_at, created_at
        FROM documents
        WHERE extension = ?
        ORDER BY datetime(updated_at) DESC, updated_at DESC, display_name ASC
        """,
        (MARKDOWN_EXTENSION,),
    ).fetchall()

    connection.execute("DELETE FROM wiki_links")
    connection.execute("DELETE FROM wiki_pages")

    if not document_rows:
        return

    page_specs: list[dict[str, object]] = []
    used_slugs: set[str] = set()
    title_map: dict[str, str] = {}

    for row in document_rows:
        path = _document_file_path(row)
        if not path or not path.exists():
            continue
        markdown_content = _read_plain_text(path)
        if not markdown_content:
            continue
        fallback_title = Path(str(row["display_name"])).stem.replace("-", " ").replace("_", " ").strip() or str(row["display_name"])
        title = _extract_markdown_title(markdown_content, fallback_title)
        base_slug = _slugify(title or fallback_title)
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)
        title_map[title.lower()] = slug
        title_map[fallback_title.lower()] = slug
        page_specs.append(
            {
                "document_id": str(row["id"]),
                "slug": slug,
                "title": title,
                "markdown_content": markdown_content,
                "source_path": str(path),
                "created_at": str(row["created_at"]),
                "updated_at": str(row["updated_at"]),
            }
        )

    page_ids_by_slug: dict[str, str] = {}
    for page in page_specs:
        page_id = uuid4().hex
        page_ids_by_slug[str(page["slug"])] = page_id
        connection.execute(
            """
            INSERT INTO wiki_pages (
                id,
                document_id,
                slug,
                title,
                markdown_content,
                source_path,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                page_id,
                page["document_id"],
                page["slug"],
                page["title"],
                page["markdown_content"],
                page["source_path"],
                page["created_at"],
                page["updated_at"],
            ),
        )

    timestamp = datetime.now(timezone.utc).isoformat()
    for page in page_specs:
        source_page_id = page_ids_by_slug[str(page["slug"])]
        for link in _extract_wiki_links(str(page["markdown_content"]), title_map, str(page["slug"])):
            target_slug = str(link["target_slug"])
            connection.execute(
                """
                INSERT INTO wiki_links (
                    id,
                    source_page_id,
                    target_slug,
                    target_page_id,
                    link_label,
                    link_kind,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    uuid4().hex,
                    source_page_id,
                    target_slug,
                    page_ids_by_slug.get(target_slug),
                    str(link["link_label"]),
                    str(link["link_kind"]),
                    timestamp,
                ),
            )


def _ensure_wiki_pages(connection: sqlite3.Connection) -> None:
    connection.row_factory = sqlite3.Row
    markdown_document_count = connection.execute(
        "SELECT COUNT(*) FROM documents WHERE extension = ?",
        (MARKDOWN_EXTENSION,),
    ).fetchone()[0]
    wiki_page_count = connection.execute("SELECT COUNT(*) FROM wiki_pages").fetchone()[0]
    if markdown_document_count and wiki_page_count < markdown_document_count:
        _rebuild_wiki_pages(connection)


def _markdown_table_separator(line: str) -> bool:
    stripped = line.strip()
    if "|" not in stripped:
        return False
    cells = [cell.strip() for cell in stripped.strip("|").split("|")]
    if not cells:
        return False
    return all(re.fullmatch(r":?-{3,}:?", cell or "") for cell in cells)


def _markdown_table_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def _parse_text_elements(text: str) -> list[dict[str, object]]:
    elements: list[dict[str, object]] = []
    heading_stack: list[str] = []
    lines = text.splitlines()
    index = 0

    while index < len(lines):
        raw_line = lines[index]
        line = raw_line.strip()
        if not line:
            index += 1
            continue

        heading_match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading_match:
            level = len(heading_match.group(1))
            heading_text = heading_match.group(2).strip()
            while len(heading_stack) >= level:
                heading_stack.pop()
            heading_stack.append(heading_text)
            elements.append(
                {
                    "element_type": "heading",
                    "section_level": level,
                    "section_path": heading_stack.copy(),
                    "content": heading_text,
                    "metadata": {"style": f"markdown-h{level}"},
                }
            )
            index += 1
            continue

        if (
            index + 1 < len(lines)
            and "|" in line
            and _markdown_table_separator(lines[index + 1])
        ):
            table_rows = [_markdown_table_row(line)]
            index += 2
            while index < len(lines) and lines[index].strip() and "|" in lines[index]:
                table_rows.append(_markdown_table_row(lines[index]))
                index += 1
            table_text = "\n".join(" | ".join(row) for row in table_rows if any(row))
            elements.append(
                {
                    "element_type": "table",
                    "section_level": 0,
                    "section_path": heading_stack.copy(),
                    "content": table_text,
                    "metadata": {"rows": table_rows},
                }
            )
            continue

        if re.match(r"^([-*]|\d+\.)\s+.+$", line):
            items: list[str] = []
            while index < len(lines):
                candidate = lines[index].strip()
                match = re.match(r"^([-*]|\d+\.)\s+(.+)$", candidate)
                if not match:
                    break
                items.append(match.group(2).strip())
                index += 1
            elements.append(
                {
                    "element_type": "list_item",
                    "section_level": 0,
                    "section_path": heading_stack.copy(),
                    "content": "\n".join(items),
                    "metadata": {},
                }
            )
            continue

        paragraph_lines = [line]
        index += 1
        while index < len(lines):
            candidate = lines[index].strip()
            if not candidate:
                index += 1
                break
            if re.match(r"^(#{1,6})\s+(.+)$", candidate):
                break
            if re.match(r"^([-*]|\d+\.)\s+.+$", candidate):
                break
            if (
                index + 1 < len(lines)
                and "|" in candidate
                and _markdown_table_separator(lines[index + 1])
            ):
                break
            paragraph_lines.append(candidate)
            index += 1

        elements.append(
            {
                "element_type": "paragraph",
                "section_level": 0,
                "section_path": heading_stack.copy(),
                "content": "\n".join(paragraph_lines),
                "metadata": {},
            }
        )
    return elements


def _extract_document_elements(path: Path) -> list[dict[str, object]]:
    suffix = path.suffix.lower()
    if suffix not in TEXT_EXTENSIONS:
        return []
    text = _read_plain_text(path)
    if text is None:
        return []
    return _parse_text_elements(text)


def _normalize_words(text: str) -> list[str]:
    return [word.lower() for word in WORD_PATTERN.findall(_fold_text(text))]


def _normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", _fold_text(text)).strip()


def _render_element_text(element_type: str, content: str) -> str:
    normalized = str(content or "").strip()
    if not normalized:
        return ""
    if element_type == "list_item":
        return f"- {normalized}"
    if element_type == "table":
        return f"Tabelle\n{normalized}"
    return normalized


def _extract_facts_from_element(
    element_index: int,
    element_type: str,
    content: str,
    metadata: dict[str, object],
) -> list[dict[str, object]]:
    facts: list[dict[str, object]] = []
    normalized_content = _normalize_element_content(content)
    if not normalized_content:
        return facts

    if element_type in {"paragraph", "list_item"}:
        for raw_line in str(content).splitlines():
            line = raw_line.strip().lstrip("-").strip()
            if ":" not in line:
                continue
            key, value = [part.strip() for part in line.split(":", 1)]
            if not key or not value:
                continue
            facts.append(
                {
                    "element_index": element_index,
                    "fact_key": key,
                    "fact_value": value,
                    "source_kind": "inline_key_value",
                }
            )

    if element_type == "table":
        rows = metadata.get("rows")
        if isinstance(rows, list):
            for row in rows:
                if not isinstance(row, list) or len(row) < 2:
                    continue
                key = _normalize_element_content(str(row[0]))
                value = _normalize_element_content(str(row[1]))
                if not key or not value:
                    continue
                facts.append(
                    {
                        "element_index": element_index,
                        "fact_key": key,
                        "fact_value": value,
                        "source_kind": "table_row",
                    }
                )
    return facts


def _build_document_payload(elements: list[dict[str, object]]) -> dict[str, object]:
    normalized_elements: list[dict[str, object]] = []
    all_facts: list[dict[str, object]] = []
    text_parts: list[str] = []
    current_offset = 0

    for raw_element in elements:
        element_type = str(raw_element.get("element_type") or "paragraph").strip() or "paragraph"
        content = _normalize_element_content(str(raw_element.get("content") or ""))
        section_level = int(raw_element.get("section_level") or 0)
        section_path = _safe_section_path(list(raw_element.get("section_path") or []))
        metadata = raw_element.get("metadata") if isinstance(raw_element.get("metadata"), dict) else {}
        if not content:
            continue

        rendered_text = _render_element_text(element_type, content)
        start_offset = current_offset
        end_offset = start_offset + len(rendered_text)
        current_offset = end_offset + 2
        element_index = len(normalized_elements)

        normalized_element = {
            "element_index": element_index,
            "element_type": element_type,
            "section_level": section_level,
            "section_path": section_path,
            "section_label": _section_label_from_path(section_path),
            "content": content,
            "rendered_text": rendered_text,
            "char_count": len(content),
            "start_offset": start_offset,
            "end_offset": end_offset,
            "metadata": metadata,
            "validation_status": _validation_status_for_content(content),
        }
        normalized_elements.append(normalized_element)
        text_parts.append(rendered_text)
        all_facts.extend(_extract_facts_from_element(element_index, element_type, content, metadata))

    return {
        "full_text": "\n\n".join(part for part in text_parts if part).strip() or None,
        "elements": normalized_elements,
        "facts": all_facts,
    }


def _read_document_payload(path: Path | None) -> dict[str, object]:
    if path is None or not path.exists() or not path.is_file():
        return {"full_text": None, "elements": [], "facts": []}
    return _build_document_payload(_extract_document_elements(path))


def _chunk_text(text: str) -> list[dict[str, int | str]]:
    paragraphs = [part.strip() for part in re.split(r"\n\s*\n+", text) if part.strip()]
    if not paragraphs:
        paragraphs = [text.strip()] if text.strip() else []
    if not paragraphs:
        return []

    chunks = []
    current_parts: list[str] = []
    current_length = 0
    current_start = 0
    running_offset = 0

    for paragraph in paragraphs:
        paragraph_length = len(paragraph)
        if current_parts and current_length + paragraph_length + 2 > MAX_PASSAGE_CHARS:
            content = "\n\n".join(current_parts)
            chunks.append(
                {
                    "content": content,
                    "section_label": f"Abschnitt {len(chunks) + 1}",
                    "start_offset": current_start,
                    "end_offset": current_start + len(content),
                }
            )
            current_parts = [paragraph]
            current_start = running_offset
            current_length = paragraph_length
        else:
            if not current_parts:
                current_start = running_offset
            current_parts.append(paragraph)
            current_length += paragraph_length + (2 if len(current_parts) > 1 else 0)
        running_offset += paragraph_length + 2

    if current_parts:
        content = "\n\n".join(current_parts)
        chunks.append(
            {
                "content": content,
                "section_label": f"Abschnitt {len(chunks) + 1}",
                "start_offset": current_start,
                "end_offset": current_start + len(content),
            }
        )

    return chunks


def _chunk_elements(elements: list[dict[str, object]], full_text: str | None) -> list[dict[str, int | str]]:
    if not elements:
        return _chunk_text(full_text or "")

    chunks: list[dict[str, int | str]] = []
    current_parts: list[str] = []
    current_start = 0
    current_end = 0
    current_label = ""
    current_length = 0

    for element in elements:
        content = str(element.get("rendered_text") or element.get("content") or "").strip()
        if not content:
            continue
        section_label = str(element.get("section_label") or "Dokument")
        start_offset = int(element.get("start_offset") or 0)
        end_offset = int(element.get("end_offset") or start_offset + len(content))
        element_type = str(element.get("element_type") or "")
        force_split = bool(current_parts and element_type == "heading")

        if current_parts and (force_split or current_length + len(content) + 2 > MAX_PASSAGE_CHARS):
            chunks.append(
                {
                    "content": "\n\n".join(current_parts),
                    "section_label": current_label or f"Abschnitt {len(chunks) + 1}",
                    "start_offset": current_start,
                    "end_offset": current_end,
                }
            )
            current_parts = []
            current_length = 0

        if not current_parts:
            current_start = start_offset
            current_label = section_label
        current_parts.append(content)
        current_length += len(content) + (2 if len(current_parts) > 1 else 0)
        current_end = end_offset

    if current_parts:
        chunks.append(
            {
                "content": "\n\n".join(current_parts),
                "section_label": current_label or f"Abschnitt {len(chunks) + 1}",
                "start_offset": current_start,
                "end_offset": current_end,
            }
        )
    return chunks


def _get_or_create_passage(connection: sqlite3.Connection, content: str) -> str:
    canonical_text = _normalize_text(content)
    searchable_text = canonical_text.lower()
    content_hash = hashlib.sha256(searchable_text.encode("utf-8")).hexdigest()

    existing = connection.execute(
        "SELECT id FROM passages WHERE content_hash = ?",
        (content_hash,),
    ).fetchone()
    if existing:
        return existing[0]

    passage_id = uuid4().hex
    connection.execute(
        """
        INSERT INTO passages (
            id,
            content_hash,
            canonical_text,
            searchable_text,
            word_count,
            char_count,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            passage_id,
            content_hash,
            canonical_text,
            searchable_text,
            len(WORD_PATTERN.findall(canonical_text)),
            len(canonical_text),
            datetime.now(timezone.utc).isoformat(),
        ),
    )
    return passage_id


def _replace_document_structure(connection: sqlite3.Connection, document_id: str, payload: dict[str, object]) -> int:
    connection.execute("DELETE FROM extracted_facts WHERE document_id = ?", (document_id,))
    connection.execute("DELETE FROM document_elements WHERE document_id = ?", (document_id,))
    connection.execute(
        "DELETE FROM document_passages WHERE document_id = ?",
        (document_id,),
    )
    full_text = payload.get("full_text")
    elements = list(payload.get("elements") or [])
    facts = list(payload.get("facts") or [])

    element_ids: dict[int, str] = {}
    created_at = datetime.now(timezone.utc).isoformat()
    for element in elements:
        element_id = uuid4().hex
        element_index = int(element.get("element_index") or 0)
        element_ids[element_index] = element_id
        connection.execute(
            """
            INSERT INTO document_elements (
                id,
                document_id,
                element_index,
                element_type,
                section_level,
                section_label,
                section_path_json,
                content,
                char_count,
                start_offset,
                end_offset,
                metadata_json,
                validation_status,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                element_id,
                document_id,
                element_index,
                str(element.get("element_type") or "paragraph"),
                int(element.get("section_level") or 0),
                str(element.get("section_label") or ""),
                json.dumps(list(element.get("section_path") or []), ensure_ascii=True),
                str(element.get("content") or ""),
                int(element.get("char_count") or 0),
                int(element.get("start_offset") or 0),
                int(element.get("end_offset") or 0),
                json.dumps(dict(element.get("metadata") or {}), ensure_ascii=True),
                str(element.get("validation_status") or VALIDATION_STATUS_VALID),
                created_at,
            ),
        )

    for fact_index, fact in enumerate(facts):
        element_id = element_ids.get(int(fact.get("element_index") or -1))
        fact_key = _normalize_element_content(str(fact.get("fact_key") or ""))
        fact_value = _normalize_element_content(str(fact.get("fact_value") or ""))
        if not element_id or not fact_key or not fact_value:
            continue
        connection.execute(
            """
            INSERT INTO extracted_facts (
                id,
                document_id,
                element_id,
                fact_index,
                fact_key,
                fact_value,
                normalized_key,
                normalized_value,
                source_kind,
                validation_status,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                uuid4().hex,
                document_id,
                element_id,
                fact_index,
                fact_key,
                fact_value,
                fact_key.lower(),
                fact_value.lower(),
                str(fact.get("source_kind") or "generic"),
                _validation_status_for_content(fact_value),
                created_at,
            ),
        )

    if not full_text:
        return 0

    chunks = _chunk_elements(elements, str(full_text))
    for index, chunk in enumerate(chunks):
        passage_id = _get_or_create_passage(connection, str(chunk["content"]))
        connection.execute(
            """
            INSERT INTO document_passages (
                id,
                document_id,
                passage_id,
                passage_index,
                section_label,
                start_offset,
                end_offset
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                uuid4().hex,
                document_id,
                passage_id,
                index,
                chunk["section_label"],
                chunk["start_offset"],
                chunk["end_offset"],
            ),
        )
    return len(chunks)


def _cleanup_orphan_passages(connection: sqlite3.Connection) -> None:
    connection.execute(
        """
        DELETE FROM passages
        WHERE id NOT IN (SELECT DISTINCT passage_id FROM document_passages)
        """
    )


def _create_import_batch(connection: sqlite3.Connection, source_type: str, source_path: str | None) -> str:
    batch_id = uuid4().hex
    connection.execute(
        """
        INSERT INTO import_batches (id, source_type, source_path, imported_at)
        VALUES (?, ?, ?, ?)
        """,
        (batch_id, source_type, source_path, datetime.now(timezone.utc).isoformat()),
    )
    return batch_id


def _delete_imported_documents(connection: sqlite3.Connection, source_types: tuple[str, ...]) -> None:
    placeholders = ", ".join("?" for _ in source_types)
    document_rows = connection.execute(
        f"SELECT id FROM documents WHERE source_type IN ({placeholders})",
        source_types,
    ).fetchall()
    document_ids = [row[0] for row in document_rows]
    if not document_ids:
        return

    document_placeholders = ", ".join("?" for _ in document_ids)
    connection.execute(
        f"DELETE FROM extracted_facts WHERE document_id IN ({document_placeholders})",
        document_ids,
    )
    connection.execute(
        f"DELETE FROM document_elements WHERE document_id IN ({document_placeholders})",
        document_ids,
    )
    connection.execute(
        f"DELETE FROM document_passages WHERE document_id IN ({document_placeholders})",
        document_ids,
    )
    connection.execute(
        f"DELETE FROM documents WHERE id IN ({document_placeholders})",
        document_ids,
    )
    _cleanup_orphan_passages(connection)


def _insert_document(
    connection: sqlite3.Connection,
    *,
    import_batch_id: str | None,
    source_type: str,
    source_path: str | None,
    stored_name: str | None,
    display_name: str,
    content_type: str | None,
    size_bytes: int,
    payload: dict[str, object],
    checksum_sha256: str,
) -> dict[str, str | int | bool | None]:
    document_id = uuid4().hex
    timestamp = datetime.now(timezone.utc).isoformat()

    connection.execute(
        """
        INSERT INTO documents (
            id,
            import_batch_id,
            source_type,
            source_path,
            stored_name,
            display_name,
            extension,
            content_type,
            size_bytes,
            checksum_sha256,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            document_id,
            import_batch_id,
            source_type,
            source_path,
            stored_name or "",
            display_name,
            Path(display_name).suffix.lower(),
            content_type,
            size_bytes,
            checksum_sha256,
            timestamp,
            timestamp,
        ),
    )

    chunk_count = _replace_document_structure(connection, document_id, payload)
    full_text = payload.get("full_text")
    return {
        "id": document_id,
        "original_name": display_name,
        "source_type": source_type,
        "source_path": source_path,
        "content_type": content_type,
        "size_bytes": size_bytes,
        "has_text": bool(full_text),
        "chunk_count": chunk_count,
        "created_at": timestamp,
    }


def _insert_rag_document(
    connection: sqlite3.Connection,
    *,
    import_batch_id: str,
    package_root: Path,
    document_manifest: dict[str, object],
) -> str:
    document_id = str(document_manifest["document_id"])
    display_name = str(document_manifest.get("title") or document_manifest.get("source_file") or document_id)
    source_file = str(document_manifest.get("source_file") or "")
    source_path = package_root / source_file if source_file else package_root
    markdown_file = str(document_manifest.get("markdown_file") or "")
    checksum_source = package_root / markdown_file if markdown_file else source_path
    checksum = _file_checksum(checksum_source) if checksum_source.exists() and checksum_source.is_file() else ""
    timestamp = datetime.now(timezone.utc).isoformat()

    connection.execute(
        """
        INSERT INTO documents (
            id,
            import_batch_id,
            source_type,
            source_path,
            stored_name,
            display_name,
            extension,
            content_type,
            size_bytes,
            checksum_sha256,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            document_id,
            import_batch_id,
            "rag_package",
            str(source_path),
            "",
            display_name,
            Path(source_file).suffix.lower(),
            "application/x-rag-package",
            int(document_manifest.get("char_count") or 0),
            checksum,
            timestamp,
            timestamp,
        ),
    )
    return document_id


def _section_label_from_chunk(chunk: dict[str, object]) -> str:
    section_path = chunk.get("section_path")
    if isinstance(section_path, list):
        parts = [str(part).strip() for part in section_path if str(part).strip()]
        if parts:
            return " > ".join(parts)

    for key in ("retrieval_hint", "section_title", "document_title"):
        value = chunk.get(key)
        if value:
            return str(value)
    return "Abschnitt"


def _import_rag_package(connection: sqlite3.Connection, root: Path) -> dict[str, int | str]:
    documents_path = root / RAG_PACKAGE_DOCUMENTS_FILE
    chunks_path = root / RAG_PACKAGE_CHUNKS_FILE

    with documents_path.open("r", encoding="utf-8") as handle:
        document_manifests = json.load(handle)

    _delete_imported_documents(connection, ("folder", "rag_package"))
    batch_id = _create_import_batch(connection, "rag_package", str(root))

    document_ids: set[str] = set()
    imported = 0
    skipped = 0

    for manifest in document_manifests:
        document_id = _insert_rag_document(
            connection,
            import_batch_id=batch_id,
            package_root=root,
            document_manifest=manifest,
        )
        document_ids.add(document_id)
        imported += 1

    with chunks_path.open("r", encoding="utf-8") as handle:
        for line_number, raw_line in enumerate(handle, start=1):
            line = raw_line.strip()
            if not line:
                continue

            chunk = json.loads(line)
            document_id = str(chunk.get("document_id") or "")
            text = str(chunk.get("text") or "").strip()
            if not document_id or document_id not in document_ids or not text:
                skipped += 1
                continue

            passage_id = _get_or_create_passage(connection, text)
            section_label = _section_label_from_chunk(chunk)
            chunk_index = int(chunk.get("chunk_index_in_document") or line_number) - 1
            char_count = int(chunk.get("char_count") or len(text))

            connection.execute(
                """
                INSERT INTO document_passages (
                    id,
                    document_id,
                    passage_id,
                    passage_index,
                    section_label,
                    start_offset,
                    end_offset
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    uuid4().hex,
                    document_id,
                    passage_id,
                    chunk_index,
                    section_label,
                    0,
                    char_count,
                ),
            )

    connection.execute(
        """
        UPDATE import_batches
        SET imported_count = ?, skipped_count = ?
        WHERE id = ?
        """,
        (imported, skipped, batch_id),
    )
    _upsert_setting(connection, "import_folder_path", str(root))
    return {"folder_path": str(root), "imported": imported, "skipped": skipped}


async def save_upload(upload: UploadFile) -> dict[str, str | int | bool | None]:
    init_storage()

    original_name = _sanitize_filename(upload.filename or "upload.bin")
    stored_name = f"{uuid4().hex}_{original_name}"
    target_path = UPLOAD_DIR / stored_name

    with target_path.open("wb") as handle:
        shutil.copyfileobj(upload.file, handle)

    payload = _read_document_payload(target_path)
    size_bytes = target_path.stat().st_size

    with sqlite3.connect(DB_PATH) as connection:
        result = _insert_document(
            connection,
            import_batch_id=None,
            source_type="upload",
            source_path=str(target_path),
            stored_name=stored_name,
            display_name=original_name,
            content_type=upload.content_type,
            size_bytes=size_bytes,
            payload=payload,
            checksum_sha256=_file_checksum(target_path),
        )
        _rebuild_wiki_pages(connection)
        connection.commit()

    return result


def list_uploads() -> list[dict[str, str | int | bool | None]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT *
            FROM document_overview
            ORDER BY datetime(updated_at) DESC
            """
        ).fetchall()
    uploads = []
    for row in rows:
        item = dict(row)
        if str(item.get("extension") or "").lower() == MARKDOWN_EXTENSION:
            slug = _slugify(Path(str(item.get("original_name") or "")).stem)
            item["wiki_url"] = f"/wiki/{slug}"
        else:
            item["wiki_url"] = ""
        uploads.append(item)
    return uploads


def _score_document_name(query_terms: set[str], display_name: str) -> int:
    name_terms = _normalize_words(Path(display_name).stem)
    unique_overlap = len(set(name_terms) & query_terms)
    overlap = sum(1 for term in name_terms if term in query_terms)
    direct_bonus = 24 if unique_overlap else 0
    return direct_bonus + (unique_overlap * 12) + overlap


def _meaningful_query_terms(query: str) -> list[str]:
    terms = [term for term in _normalize_words(query) if len(term) > 1]
    filtered = [term for term in terms if term not in GERMAN_STOP_WORDS]
    return filtered or terms


def _query_phrases(query: str) -> list[str]:
    terms = _meaningful_query_terms(query)
    phrases: list[str] = []
    for size in (3, 2):
        for index in range(len(terms) - size + 1):
            phrases.append(" ".join(terms[index:index + size]))
    return phrases


def _is_definition_query(query: str) -> bool:
    normalized = _fold_text(query).strip()
    return normalized.startswith("was ist ") or normalized.startswith("was sind ") or normalized.startswith("wer ist ")


def retrieve_relevant_chunks(query: str, document_ids: list[str]) -> list[dict[str, str | int]]:
    init_storage()
    if not document_ids:
        return []

    placeholders = ", ".join("?" for _ in document_ids)
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            f"""
            SELECT
                dp.document_id,
                d.display_name AS original_name,
                dp.passage_index,
                dp.section_label,
                p.canonical_text AS content,
                p.searchable_text
            FROM document_passages dp
            JOIN documents d ON d.id = dp.document_id
            JOIN passages p ON p.id = dp.passage_id
            WHERE dp.document_id IN ({placeholders})
            ORDER BY d.display_name, dp.passage_index
            """,
            document_ids,
        ).fetchall()

    query_terms_list = _meaningful_query_terms(query)
    query_terms = set(query_terms_list)
    query_phrases = _query_phrases(query)
    definition_query = _is_definition_query(query)
    document_name_scores: dict[str, int] = {}
    for row in rows:
        document_id = str(row["document_id"])
        if document_id not in document_name_scores:
            document_name_scores[document_id] = _score_document_name(query_terms, row["original_name"])

    ranked = []
    for row in rows:
        content_terms = _normalize_words(row["content"])
        content_term_set = set(content_terms)
        section_terms = _normalize_words(row["section_label"])
        section_term_set = set(section_terms)
        combined_text = _normalize_text(f"{row['section_label']} {row['content']}")

        overlap = sum(1 for term in content_terms if term in query_terms)
        unique_overlap = len(content_term_set & query_terms)
        section_overlap = sum(1 for term in section_terms if term in query_terms)
        unique_section_overlap = len(section_term_set & query_terms)
        phrase_bonus = sum(18 for phrase in query_phrases if phrase and phrase in combined_text)
        exact_bonus = 28 if _normalize_text(query).strip() and _normalize_text(query).strip() in combined_text else 0
        coverage_bonus = 10 if query_terms and query_terms.issubset(content_term_set | section_term_set) else 0
        overview_bonus = 0
        if definition_query:
            if int(row["passage_index"]) <= 1:
                overview_bonus += 10
            if any(
                marker in _fold_text(str(row["section_label"]))
                for marker in ("kurzbeschreibung", "uberblick", "einfuhrung", "grundlagen", "definition")
            ):
                overview_bonus += 14

        score = (
            overlap
            + (unique_overlap * 6)
            + (section_overlap * 5)
            + (unique_section_overlap * 10)
            + phrase_bonus
            + exact_bonus
            + coverage_bonus
            + overview_bonus
            + document_name_scores.get(str(row["document_id"]), 0)
        )
        ranked.append(
            {
                "document_id": row["document_id"],
                "original_name": row["original_name"],
                "section_index": row["passage_index"],
                "section_label": row["section_label"],
                "content": row["content"],
                "score": score,
            }
        )

    ranked.sort(key=lambda item: (item["score"], -int(item["section_index"])), reverse=True)

    selected = []
    seen_passages: set[str] = set()
    per_document_counts: dict[str, int] = {}
    for item in ranked:
        if item["score"] <= 0:
            continue
        passage_key = hashlib.sha256(_normalize_text(str(item["content"])).lower().encode("utf-8")).hexdigest()
        if passage_key in seen_passages:
            continue
        document_id = str(item["document_id"])
        if per_document_counts.get(document_id, 0) >= 2:
            continue
        seen_passages.add(passage_key)
        selected.append(item)
        per_document_counts[document_id] = per_document_counts.get(document_id, 0) + 1
        if len(selected) >= 6:
            break

    if not selected:
        selected = ranked[:3]
    return selected


def build_context(query: str, document_ids: list[str]) -> tuple[str, list[dict[str, str | int]]]:
    selected = retrieve_relevant_chunks(query, document_ids)
    page_lookup = get_wiki_page_lookup()
    blocks = []
    sources = []

    for order, section in enumerate(selected, start=1):
        wiki_page = page_lookup.get(str(section["document_id"]))
        section_anchor = _slugify(str(section["section_label"]))
        blocks.append(
            f"Quelle {order} | Wiki: {wiki_page['title'] if wiki_page else section['original_name']} | {section['section_label']}\n{section['content']}"
        )
        sources.append(
            {
                "label": f"Quelle {order}",
                "file_name": str(section["original_name"]),
                "page_title": str(wiki_page["title"]) if wiki_page else str(section["original_name"]),
                "wiki_slug": str(wiki_page["slug"]) if wiki_page else "",
                "url": f"/wiki/{wiki_page['slug']}#{section_anchor}" if wiki_page else "",
                "chunk_index": int(section["section_index"]) + 1,
                "section_label": str(section["section_label"]),
                "excerpt": str(section["content"])[:320],
            }
        )

    return "\n\n".join(blocks), sources


def _derive_chat_title(content: str) -> str:
    normalized = _normalize_text(content)
    if not normalized:
        return "Neuer Chat"
    return normalized[:60] + ("..." if len(normalized) > 60 else "")


def create_chat(title: str = "Neuer Chat", scope: str = "local", client_id: str = "") -> dict[str, str]:
    init_storage()
    chat_id = uuid4().hex
    timestamp = datetime.now(timezone.utc).isoformat()

    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
        connection.execute(
            """
            INSERT INTO chats (id, project_id, title, scope, client_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (chat_id, project_id, title, scope, client_id, timestamp, timestamp),
        )
        connection.commit()

    return {
        "id": chat_id,
        "title": title,
        "scope": scope,
        "client_id": client_id,
        "created_at": timestamp,
        "updated_at": timestamp,
    }


def list_chats(scope: str = "local", client_id: str = "") -> list[dict[str, str | int]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        rows = connection.execute(
            """
            SELECT
                c.id,
                c.title,
                c.scope,
                c.client_id,
                c.created_at,
                c.updated_at,
                COUNT(m.id) AS message_count
            FROM chats c
            LEFT JOIN chat_messages m ON m.chat_id = c.id
            WHERE c.project_id = ? AND c.scope = ? AND c.client_id = ?
            GROUP BY c.id
            ORDER BY datetime(c.updated_at) DESC, c.updated_at DESC
            """
            ,
            (project_id, scope, client_id),
        ).fetchall()
    return [dict(row) for row in rows]


def get_chat(chat_id: str, scope: str = "local", client_id: str = "") -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        chat_row = connection.execute(
            "SELECT id, title, scope, client_id, created_at, updated_at FROM chats WHERE id = ? AND project_id = ? AND scope = ? AND client_id = ?",
            (chat_id, project_id, scope, client_id),
        ).fetchone()
        if not chat_row:
            return None

        message_rows = connection.execute(
            """
            SELECT role, content, sources_json, created_at
            FROM chat_messages
            WHERE chat_id = ?
            ORDER BY sort_order, created_at
            """,
            (chat_id,),
        ).fetchall()

    messages = []
    for row in message_rows:
        messages.append(
            {
                "role": row["role"],
                "content": row["content"],
                "sources": json.loads(row["sources_json"]),
                "created_at": row["created_at"],
            }
        )

    return {
        "id": chat_row["id"],
        "title": chat_row["title"],
        "scope": chat_row["scope"],
        "client_id": chat_row["client_id"],
        "created_at": chat_row["created_at"],
        "updated_at": chat_row["updated_at"],
        "messages": messages,
    }


def _get_chat_history_messages(connection: sqlite3.Connection, chat_id: str) -> list[dict[str, str]]:
    connection.row_factory = sqlite3.Row
    rows = connection.execute(
        """
        SELECT role, content
        FROM chat_messages
        WHERE chat_id = ?
        ORDER BY sort_order, created_at
        """,
        (chat_id,),
    ).fetchall()
    return [{"role": row["role"], "content": row["content"]} for row in rows]


def save_chat_exchange(
    *,
    chat_id: str | None,
    user_message: str,
    assistant_message: str,
    sources: list[dict[str, str | int]],
    scope: str = "local",
    client_id: str = "",
) -> dict[str, str]:
    init_storage()
    timestamp = datetime.now(timezone.utc).isoformat()

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        project_id = _get_active_project_id(connection)
        chat_row = None
        if chat_id:
            chat_row = connection.execute(
                "SELECT id, title FROM chats WHERE id = ? AND project_id = ? AND scope = ? AND client_id = ?",
                (chat_id, project_id, scope, client_id),
            ).fetchone()

        if not chat_row:
            chat_id = uuid4().hex
            title = _derive_chat_title(user_message)
            connection.execute(
                """
                INSERT INTO chats (id, project_id, title, scope, client_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (chat_id, project_id, title, scope, client_id, timestamp, timestamp),
            )
        else:
            title = chat_row["title"]
            if title == "Neuer Chat":
                title = _derive_chat_title(user_message)
            connection.execute(
                """
                UPDATE chats
                SET title = ?, updated_at = ?
                WHERE id = ?
                """,
                (title, timestamp, chat_id),
            )

        next_sort_order = connection.execute(
            "SELECT COALESCE(MAX(sort_order), 0) FROM chat_messages WHERE chat_id = ?",
            (chat_id,),
        ).fetchone()[0]

        for index, (role, content, message_sources) in enumerate(
            (
                ("user", user_message, []),
                ("assistant", assistant_message, sources),
            ),
            start=1,
        ):
            connection.execute(
                """
                INSERT INTO chat_messages (
                    id,
                    chat_id,
                    role,
                    content,
                    sources_json,
                    sort_order,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    uuid4().hex,
                    chat_id,
                    role,
                    content,
                    json.dumps(message_sources, ensure_ascii=True),
                    next_sort_order + index,
                    timestamp,
                ),
            )

        connection.execute(
            "UPDATE chats SET updated_at = ? WHERE id = ?",
            (timestamp, chat_id),
        )
        connection.commit()

    return {
        "chat_id": str(chat_id),
        "title": title,
    }


def get_chat_history(chat_id: str, scope: str = "local", client_id: str = "") -> list[dict[str, str]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
        exists = connection.execute(
            "SELECT id FROM chats WHERE id = ? AND project_id = ? AND scope = ? AND client_id = ?",
            (chat_id, project_id, scope, client_id),
        ).fetchone()
        if not exists:
            return []
        return _get_chat_history_messages(connection, chat_id)


def delete_chat(chat_id: str, scope: str = "local", client_id: str = "") -> bool:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        project_id = _get_active_project_id(connection)
        existing = connection.execute(
            "SELECT id FROM chats WHERE id = ? AND project_id = ? AND scope = ? AND client_id = ?",
            (chat_id, project_id, scope, client_id),
        ).fetchone()
        if not existing:
            return False

        connection.execute("DELETE FROM chat_messages WHERE chat_id = ?", (chat_id,))
        connection.execute("DELETE FROM chats WHERE id = ?", (chat_id,))
        connection.commit()
    return True


def _can_see_private_command_messages(user_role: str) -> bool:
    return str(user_role or "").strip().lower() in {"spielleiter", "admin"}


def list_command_messages(username: str = "", user_role: str = "", limit: int = 100) -> list[dict[str, str]]:
    init_storage()
    normalized_username = str(username or "").strip().lower()
    can_see_private = _can_see_private_command_messages(user_role)
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        if can_see_private:
            rows = connection.execute(
                """
                SELECT role, username, content, visibility, recipient_username, created_at
                FROM command_messages
                ORDER BY datetime(created_at) ASC, created_at ASC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        else:
            rows = connection.execute(
                """
                SELECT role, username, content, visibility, recipient_username, created_at
                FROM command_messages
                WHERE visibility = 'public'
                   OR (visibility = 'gmroll' AND lower(recipient_username) = ?)
                ORDER BY datetime(created_at) ASC, created_at ASC
                LIMIT ?
                """,
                (normalized_username, limit),
            ).fetchall()
    return [
        {
            "role": row["role"],
            "username": row["username"],
            "content": row["content"],
            "visibility": row["visibility"],
            "recipient_username": row["recipient_username"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


def _insert_command_message(
    connection: sqlite3.Connection,
    role: str,
    username: str,
    content: str,
    *,
    visibility: str = "public",
    recipient_username: str = "",
) -> dict[str, str]:
    timestamp = datetime.now(timezone.utc).isoformat()
    normalized_visibility = visibility if visibility in {"public", "gmroll", "hiddenroll"} else "public"
    connection.execute(
        """
        INSERT INTO command_messages (id, role, username, content, visibility, recipient_username, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (uuid4().hex, role, username, content, normalized_visibility, recipient_username, timestamp),
    )
    return {
        "role": role,
        "username": username,
        "content": content,
        "visibility": normalized_visibility,
        "recipient_username": recipient_username,
        "created_at": timestamp,
    }


_ROLL_DICE_PATTERN = re.compile(r"(\d*)d(100|20|12|10|8|6|4|2)", re.IGNORECASE)
_ROLL_TOKEN_PATTERN = re.compile(r"([+-]?)\s*(?:(\d*)\s*d\s*(100|20|12|10|8|6|4|2)|(\d+))", re.IGNORECASE)


def _parse_roll_expression(expression: str) -> list[dict[str, int | str]]:
    compact_expression = re.sub(r"\s+", "", str(expression or ""))
    if not compact_expression:
        raise ValueError("Bitte einen Wurf wie /roll d20 oder /roll 1d20+2d10+3 angeben.")

    position = 0
    tokens: list[dict[str, int | str]] = []
    while position < len(compact_expression):
        match = _ROLL_TOKEN_PATTERN.match(compact_expression, position)
        if not match:
            raise ValueError("Ungueltiger Wurfausdruck. Erlaubt sind z. B. d20, 2d6, 1d20+2d10+3.")
        sign_symbol, count_value, sides_value, flat_value = match.groups()
        sign = -1 if sign_symbol == "-" else 1
        if sides_value:
            count = int(count_value or "1")
            sides = int(sides_value)
            if count <= 0:
                raise ValueError("Die Anzahl der Wuerfel muss groesser als 0 sein.")
            tokens.append({"kind": "dice", "count": count, "sides": sides, "sign": sign})
        else:
            flat_number = int(flat_value or "0")
            tokens.append({"kind": "flat", "value": flat_number * sign})
        position = match.end()
    return tokens


def _normalize_roll_expression(expression: str) -> str:
    compact_expression = re.sub(r"\s+", "", str(expression or ""))
    normalized = compact_expression.lower()
    if normalized.startswith("+"):
        normalized = normalized[1:]
    return normalized


def _execute_roll_expression(username: str, expression: str) -> str:
    tokens = _parse_roll_expression(expression)
    parts: list[str] = []
    total = 0

    for token in tokens:
        kind = str(token["kind"])
        if kind == "dice":
            count = int(token["count"])
            sides = int(token["sides"])
            sign = int(token["sign"])
            for _ in range(count):
                value = secrets.randbelow(sides) + 1
                total += value * sign
                if sign < 0:
                    parts.append(f"-{value}")
                elif parts:
                    parts.append(f"+{value}")
                else:
                    parts.append(str(value))
            continue
        value = int(token["value"])
        total += value
        absolute_value = abs(value)
        if value < 0:
            parts.append(f"-{absolute_value}")
        elif parts:
            parts.append(f"+{absolute_value}")
        else:
            parts.append(str(absolute_value))

    if not parts:
        raise ValueError("Bitte mindestens einen Wuerfel oder eine Zahl angeben.")

    normalized_expression = _normalize_roll_expression(expression)
    joined_parts = "".join(parts)
    return f"{username} wuerfelt {normalized_expression}: {joined_parts} = {total}"


def _parse_roll_command(message: str) -> tuple[str, str] | None:
    match = re.match(r"^/(roll|gmroll|hiddenroll)(?:\s+(.+))?$", message, re.IGNORECASE)
    if not match:
        return None
    return match.group(1).lower(), (match.group(2) or "").strip()


def add_command_message(username: str, content: str, user_role: str = "") -> list[dict[str, str]]:
    init_storage()
    normalized = content.strip()
    if not normalized:
        raise ValueError("Befehl ist leer.")

    with sqlite3.connect(DB_PATH) as connection:
        roll_command = _parse_roll_command(normalized)
        visibility = "public"
        recipient_username = ""
        if roll_command:
            command_name, expression = roll_command
            visibility = "gmroll" if command_name == "gmroll" else "hiddenroll" if command_name == "hiddenroll" else "public"
            recipient_username = username if visibility == "gmroll" else ""
            created_messages = [
                _insert_command_message(
                    connection,
                    "user",
                    username,
                    normalized,
                    visibility=visibility,
                    recipient_username=recipient_username,
                )
            ]
            try:
                result_text = _execute_roll_expression(username, expression)
            except ValueError as exc:
                created_messages.append(
                    _insert_command_message(
                        connection,
                        "system",
                        "System",
                        f"{username}: {exc}",
                        visibility=visibility,
                        recipient_username=recipient_username,
                    )
                )
            else:
                created_messages.append(
                    _insert_command_message(
                        connection,
                        "system",
                        "System",
                        result_text,
                        visibility=visibility,
                        recipient_username=recipient_username,
                    )
                )
            connection.commit()
            return [
                message
                for message in created_messages
                if visibility == "public"
                or _can_see_private_command_messages(user_role)
                or (visibility == "gmroll" and message.get("recipient_username", "").lower() == username.lower())
            ]

        created_messages = [_insert_command_message(connection, "user", username, normalized)]
        lowered = normalized.lower()
        if lowered.startswith("/"):
            created_messages.append(
                _insert_command_message(
                    connection,
                    "system",
                    "System",
                    f"{username}: Unbekannter Befehl. Verfuegbar: /roll d20, /gmroll d20, /hiddenroll d20, /roll 2d6+3",
                )
            )

        connection.commit()

    return created_messages


def clear_command_messages() -> None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("DELETE FROM command_messages")
        connection.commit()


def reindex_uploads() -> int:
    init_storage()
    updated = 0

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT id, source_type, source_path, stored_name
            FROM documents
            WHERE source_type IN ('upload', 'folder')
            """
        ).fetchall()

        for row in rows:
            if row["source_type"] == "upload":
                path = UPLOAD_DIR / row["stored_name"]
            else:
                path = Path(row["source_path"]) if row["source_path"] else None

            payload = _read_document_payload(path) if path and path.exists() else {"full_text": None, "elements": [], "facts": []}
            checksum = _file_checksum(path) if path and path.exists() else ""
            connection.execute(
                """
                UPDATE documents
                SET checksum_sha256 = ?, updated_at = ?
                WHERE id = ?
                """,
                (checksum, datetime.now(timezone.utc).isoformat(), row["id"]),
            )
            _replace_document_structure(connection, row["id"], payload)
            updated += 1

        _rebuild_wiki_pages(connection)
        _cleanup_orphan_passages(connection)
        connection.commit()
    return updated


def import_folder(folder_path: str) -> dict[str, int | str]:
    init_storage()
    root = Path(folder_path).expanduser()
    if not root.exists() or not root.is_dir():
        raise ValueError(f"Ordner nicht gefunden: {folder_path}")

    with sqlite3.connect(DB_PATH) as connection:
        if (root / RAG_PACKAGE_CHUNKS_FILE).exists() and (root / RAG_PACKAGE_DOCUMENTS_FILE).exists():
            result = _import_rag_package(connection, root)
            _rebuild_wiki_pages(connection)
            connection.commit()
            return result

        imported = 0
        skipped = 0

        _delete_imported_documents(connection, ("folder", "rag_package"))
        batch_id = _create_import_batch(connection, "folder", str(root))

        for path in root.rglob("*"):
            if not path.is_file():
                continue

            payload = _read_document_payload(path)
            if path.suffix.lower() not in TEXT_EXTENSIONS:
                skipped += 1
                continue
            if not payload.get("full_text"):
                skipped += 1
                continue

            _insert_document(
                connection,
                import_batch_id=batch_id,
                source_type="folder",
                source_path=str(path),
                stored_name=None,
                display_name=path.name,
                content_type=None,
                size_bytes=path.stat().st_size,
                payload=payload,
                checksum_sha256=_file_checksum(path),
            )
            imported += 1

        connection.execute(
            """
            UPDATE import_batches
            SET imported_count = ?, skipped_count = ?
            WHERE id = ?
            """,
            (imported, skipped, batch_id),
        )
        _upsert_setting(connection, "import_folder_path", str(root))
        _rebuild_wiki_pages(connection)
        connection.commit()

    return {"folder_path": str(root), "imported": imported, "skipped": skipped}


def get_wiki_page_lookup() -> dict[str, dict[str, str]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        _ensure_wiki_pages(connection)
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            "SELECT document_id, slug, title FROM wiki_pages ORDER BY title COLLATE NOCASE ASC"
        ).fetchall()
    return {
        str(row["document_id"]): {
            "slug": str(row["slug"]),
            "title": str(row["title"]),
        }
        for row in rows
    }


def list_wiki_pages() -> list[dict[str, object]]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        _ensure_wiki_pages(connection)
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT
                wp.slug,
                wp.title,
                wp.updated_at,
                d.display_name,
                COUNT(DISTINCT wl.id) AS outgoing_count,
                COUNT(DISTINCT bl.id) AS backlink_count
            FROM wiki_pages wp
            JOIN documents d ON d.id = wp.document_id
            LEFT JOIN wiki_links wl ON wl.source_page_id = wp.id AND wl.target_page_id IS NOT NULL
            LEFT JOIN wiki_links bl ON bl.target_page_id = wp.id
            GROUP BY wp.id
            ORDER BY wp.title COLLATE NOCASE ASC
            """
        ).fetchall()
    return [
        {
            "slug": str(row["slug"]),
            "title": str(row["title"]),
            "display_name": str(row["display_name"]),
            "updated_at": str(row["updated_at"]),
            "outgoing_count": int(row["outgoing_count"] or 0),
            "backlink_count": int(row["backlink_count"] or 0),
            "url": f"/wiki/{row['slug']}",
        }
        for row in rows
    ]


def get_wiki_page(slug: str) -> dict[str, object] | None:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        _ensure_wiki_pages(connection)
        connection.row_factory = sqlite3.Row
        page_row = connection.execute(
            """
            SELECT wp.id, wp.slug, wp.title, wp.markdown_content, wp.updated_at, d.display_name
            FROM wiki_pages wp
            JOIN documents d ON d.id = wp.document_id
            WHERE wp.slug = ?
            """,
            (slug,),
        ).fetchone()
        if not page_row:
            return None

        outgoing_rows = connection.execute(
            """
            SELECT DISTINCT
                wl.target_slug,
                COALESCE(tp.title, wl.link_label) AS title,
                wl.link_label,
                wl.link_kind
            FROM wiki_links wl
            LEFT JOIN wiki_pages tp ON tp.id = wl.target_page_id
            WHERE wl.source_page_id = ?
            ORDER BY title COLLATE NOCASE ASC
            """,
            (page_row["id"],),
        ).fetchall()
        backlink_rows = connection.execute(
            """
            SELECT DISTINCT
                sp.slug,
                sp.title,
                wl.link_kind
            FROM wiki_links wl
            JOIN wiki_pages sp ON sp.id = wl.source_page_id
            WHERE wl.target_page_id = ?
            ORDER BY sp.title COLLATE NOCASE ASC
            """,
            (page_row["id"],),
        ).fetchall()

    return {
        "slug": str(page_row["slug"]),
        "title": str(page_row["title"]),
        "display_name": str(page_row["display_name"]),
        "markdown_content": str(page_row["markdown_content"]),
        "updated_at": str(page_row["updated_at"]),
        "url": f"/wiki/{page_row['slug']}",
        "links": [
            {
                "slug": str(row["target_slug"]),
                "title": str(row["title"]),
                "label": str(row["link_label"]),
                "kind": str(row["link_kind"]),
                "url": f"/wiki/{row['target_slug']}",
            }
            for row in outgoing_rows
            if str(row["target_slug"])
        ],
        "backlinks": [
            {
                "slug": str(row["slug"]),
                "title": str(row["title"]),
                "kind": str(row["link_kind"]),
                "url": f"/wiki/{row['slug']}",
            }
            for row in backlink_rows
        ],
    }


def list_tables() -> list[str]:
    init_storage()
    with sqlite3.connect(DB_PATH) as connection:
        rows = connection.execute(
            """
            SELECT name
            FROM sqlite_master
            WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'
            ORDER BY type, name
            """
        ).fetchall()
    return [row[0] for row in rows]


def run_sql_query(query: str, *, allow_write: bool = False) -> dict[str, object]:
    init_storage()
    normalized = query.strip()
    if not normalized:
        raise ValueError("SQL-Abfrage ist leer.")
    if ";" in normalized.rstrip(";"):
        raise ValueError("Bitte nur eine einzelne SQL-Abfrage ausfuehren.")
    lowered = normalized.lower().lstrip()
    is_readonly = lowered.startswith(READONLY_SQL_PREFIXES)
    if not allow_write and not is_readonly:
        raise ValueError("Nur lesende SQL-Abfragen sind erlaubt.")

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.execute(normalized)
        if cursor.description:
            rows = cursor.fetchall()
            columns = [description[0] for description in cursor.description]
        else:
            connection.commit()
            rows = []
            columns = []

    return {
        "columns": columns,
        "rows": [[row[column] for column in columns] for row in rows],
        "row_count": len(rows),
    }
