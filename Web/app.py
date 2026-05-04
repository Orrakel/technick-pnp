from pathlib import Path
import sys
import mimetypes

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from Eldran import AGENT_NAME, DEFAULT_TEMPERATURE, OLLAMA_MODEL, OLLAMA_URL, ask_eldran
from storage import (
    add_map_ping,
    authenticate_user,
    add_map_drawing_stroke,
    add_battlemap_token,
    add_battlemap_fog_door,
    add_battlemap_fog_wall,
    build_context,
    create_map,
    create_battlemap,
    create_user,
    create_user_session,
    complete_map_sound_cue,
    create_chat,
    clear_map_drawings,
    create_map_layer,
    delete_map_overlay,
    delete_map_pin,
    delete_chat,
    delete_map,
    delete_battlemap_token,
    delete_battlemap_fog_segment,
    delete_last_battlemap_fog_element,
    delete_user_session,
    filter_battlemap_for_visibility,
    get_map_sound_cue,
    get_music_state,
    get_map_pin_group_members,
    get_chat,
    get_chat_history,
    get_map_drawings,
    get_map_image_info,
    get_map_image_path,
    get_battlemap,
    get_battlemap_background_path,
    get_battlemap_token_image_path,
    get_map_overlay_image_path,
    get_map_overlays,
    get_map_pin,
    get_map_pin_image_path,
    get_map_pin_sound_path,
    get_map_pins,
    get_map_pings,
    get_setting,
    get_user_by_session_token,
    get_wiki_page,
    import_folder,
    init_storage,
    get_map_layer_fog,
    list_maps,
    list_map_layers,
    list_battlemaps,
    list_projects,
    list_project_players,
    list_users,
    list_command_messages,
    list_chats,
    list_tables,
    list_uploads,
    list_wiki_pages,
    reindex_uploads,
    run_sql_query,
    add_command_message,
    activate_current_map_surface,
    add_map_layer_fog_door,
    clear_command_messages,
    clear_music_state,
    group_map_tokens,
    get_music_file_path,
    list_music_tracks,
    save_map_image,
    save_map_overlay,
    save_map_pin,
    save_music_track,
    select_music_track,
    save_upload,
    save_chat_exchange,
    rename_map,
    rename_map_layer,
    create_project,
    set_project_player_assignment,
    update_map_layer_fog,
    save_battlemap_background,
    save_battlemap_token_image,
    set_active_map,
    set_active_battlemap,
    trigger_map_sound_cue,
    update_music_playback,
    ungroup_map_tokens,
    undo_last_map_drawing_stroke,
    end_battlemap_token_turn,
    update_map_overlay_geometry,
    update_map_overlay_visibility_layer,
    add_map_layer_fog_wall,
    delete_map_layer_fog_door,
    delete_map_layer_fog_wall,
    update_map_pin_details,
    update_map_pin_position,
    update_map_pin_visibility_layer,
    update_map_layer_fog_door,
    update_battlemap_config,
    update_battlemap_fog,
    update_battlemap_fog_door,
    update_battlemap_obstacles,
    update_battlemap_token,
    update_user_role,
    get_character_sheet,
    get_character_sheet_pdf_path,
    list_character_sheets,
    save_character_sheet,
    save_character_sheet_pdf,
    delete_character_sheet_pdf,
    set_active_project,
)

STATIC_DIR = BASE_DIR / "static"
SESSION_COOKIE_NAME = "eldran_session"
LOCAL_ADMIN_USER = {"id": "local-admin", "username": "Spielleiter", "role": "admin"}

app = FastAPI(title="Eldran Web Chat")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
init_storage()


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: list[ChatMessage] = Field(default_factory=list)
    file_ids: list[str] = Field(default_factory=list)
    temperature: float = Field(default=DEFAULT_TEMPERATURE, ge=0.0, le=2.0)
    chat_id: str | None = None
    chat_scope: str = Field(default="local", pattern="^(local|remote)$")
    client_id: str = ""


class CreateChatRequest(BaseModel):
    title: str = Field(default="Neuer Chat", min_length=1)
    chat_scope: str = Field(default="local", pattern="^(local|remote)$")
    client_id: str = ""


class FolderImportRequest(BaseModel):
    folder_path: str = Field(min_length=1)


class SqlQueryRequest(BaseModel):
    query: str = Field(min_length=1)


class CommandChatRequest(BaseModel):
    message: str = Field(min_length=1)


class RegisterRequest(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)
    password_confirm: str = Field(min_length=1)


class CreateUserRequest(RegisterRequest):
    role: str = Field(default="spieler", pattern="^(spieler|spielleiter|admin)$")


class LoginRequest(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)


class UpdateUserRoleRequest(BaseModel):
    role: str = Field(pattern="^(spieler|spielleiter|admin)$")


class MapPoint(BaseModel):
    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)


class MapStrokeRequest(BaseModel):
    color: str = Field(default="#ff6b6b", min_length=1)
    width: float = Field(default=3.0, ge=1.0, le=24.0)
    points: list[MapPoint] = Field(min_length=1)


class MapPingRequest(BaseModel):
    color: str = Field(default="#ff6b6b", min_length=1)
    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)


class MapPinPositionRequest(BaseModel):
    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)


class MapTokenGroupRequest(BaseModel):
    token_ids: list[str] = Field(min_length=1)


class MusicPlaybackRequest(BaseModel):
    is_playing: bool | None = None
    position_seconds: float | None = Field(default=None, ge=0.0)


class MusicTrackSelectRequest(BaseModel):
    track_id: str = Field(min_length=1)


class MapOverlayGeometryRequest(BaseModel):
    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)
    width: float = Field(ge=0.04, le=1.0)
    height: float = Field(ge=0.04, le=1.0)


class VisibilityLayerRequest(BaseModel):
    visibility_layer: str = Field(pattern="^(public|gm)$")


class CreateMapRequest(BaseModel):
    name: str = Field(min_length=1)


class RenameMapRequest(BaseModel):
    name: str = Field(min_length=1)


class CreateProjectRequest(BaseModel):
    name: str = Field(min_length=1)
    ruleset: str = Field(default="dnd", pattern="^(dnd|nova_gaia)$")


class SetupProjectRequest(BaseModel):
    name: str = Field(min_length=1)
    ruleset: str = Field(default="dnd", pattern="^(dnd|nova_gaia)$")
    player_ids: list[str] = Field(default_factory=list)
    create_empty_map: bool = True
    map_name: str = Field(default="Startkarte", min_length=1)


class SetActiveProjectRequest(BaseModel):
    project_id: str = Field(min_length=1)


class ProjectPlayerAssignmentRequest(BaseModel):
    user_id: str = Field(min_length=1)
    assigned: bool


class CharacterSheetUpdateRequest(BaseModel):
    project_id: str = ""
    data: dict[str, object] = Field(default_factory=dict)


class RenameMapLayerRequest(BaseModel):
    name: str = Field(min_length=1)


class MapLayerFogRequest(BaseModel):
    enabled: bool | None = None
    explored_areas: list[dict[str, float]] | None = None


class MapFogWallRequest(BaseModel):
    x1: float = Field(ge=0.0, le=1.0)
    y1: float = Field(ge=0.0, le=1.0)
    x2: float = Field(ge=0.0, le=1.0)
    y2: float = Field(ge=0.0, le=1.0)


class MapFogDoorUpdateRequest(BaseModel):
    is_open: bool = False


class BattlemapConfigRequest(BaseModel):
    name: str = Field(min_length=1)
    grid_width: int = Field(default=12, ge=4, le=64)
    grid_height: int = Field(default=8, ge=4, le=64)
    cell_size: int = Field(default=64, ge=24, le=160)
    scale_percent: int = Field(default=100, ge=25, le=300)
    obstacle_color: str = Field(default="#7f858c", min_length=7, max_length=7)


class BattlemapObstacleRequest(BaseModel):
    obstacles: list[dict[str, int]] = Field(default_factory=list)


class BattlemapFogRequest(BaseModel):
    enabled: bool | None = None


class BattlemapFogSegmentRequest(BaseModel):
    x1: int = Field(ge=0)
    y1: int = Field(ge=0)
    x2: int = Field(ge=0)
    y2: int = Field(ge=0)


class BattlemapFogDoorUpdateRequest(BaseModel):
    is_open: bool


class BattlemapTokenCreateRequest(BaseModel):
    name: str = Field(min_length=1)
    type: str = Field(default="player", pattern="^(player|enemy)$")
    x: int = Field(ge=0)
    y: int = Field(ge=0)
    color: str = Field(default="#58c4ff", min_length=1)
    initiative: int = Field(default=10, ge=0, le=99)
    move_range: int = Field(default=4, ge=0, le=20)
    attack_range: int = Field(default=1, ge=0, le=20)
    vision_range: int = Field(default=6, ge=1, le=24)
    assigned_user_id: str = ""
    visibility_layer: str = Field(default="public", pattern="^(public|gm)$")


class BattlemapTokenUpdateRequest(BaseModel):
    name: str | None = None
    type: str | None = Field(default=None, pattern="^(player|enemy)$")
    x: int | None = Field(default=None, ge=0)
    y: int | None = Field(default=None, ge=0)
    color: str | None = None
    initiative: int | None = Field(default=None, ge=0, le=99)
    move_range: int | None = Field(default=None, ge=0, le=20)
    attack_range: int | None = Field(default=None, ge=0, le=20)
    vision_range: int | None = Field(default=None, ge=1, le=24)
    assigned_user_id: str | None = None
    visibility_layer: str | None = Field(default=None, pattern="^(public|gm)$")
    ignore_turn_rules: bool = False


def _current_user_from_request(request: Request) -> dict[str, str] | None:
    if _is_local_request(request):
        return LOCAL_ADMIN_USER
    auth_header = str(request.headers.get("authorization") or "").strip()
    token = ""
    if auth_header.lower().startswith("bearer "):
        token = auth_header[7:].strip()
    user = get_user_by_session_token(token)
    if user:
        return user
    return None


def _require_user(request: Request) -> dict[str, str]:
    user = _current_user_from_request(request)
    if not user:
        raise HTTPException(status_code=401, detail="Nicht eingeloggt.")
    return user


def _require_admin(request: Request) -> dict[str, str]:
    user = _require_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin-Rechte erforderlich.")
    return user


def _require_local_admin(request: Request) -> dict[str, str]:
    return _require_admin(request)


def _require_spielleiter_or_admin(request: Request) -> dict[str, str]:
    user = _require_user(request)
    if user.get("role") not in {"spielleiter", "admin"}:
        raise HTTPException(status_code=403, detail="Spielleiter- oder Admin-Rechte erforderlich.")
    return user


def _protected_page(request: Request, file_name: str) -> FileResponse | RedirectResponse:
    if not _is_local_request(request):
        return FileResponse(STATIC_DIR / file_name)
    if not _current_user_from_request(request):
        return RedirectResponse(url="/login", status_code=307)
    return FileResponse(STATIC_DIR / file_name)


def _is_local_request(request: Request) -> bool:
    client_host = request.client.host if request.client else ""
    host_header = str(request.headers.get("host") or "").split(":", 1)[0].strip().lower()
    return client_host in {"127.0.0.1", "::1", "localhost"} and host_header in {"127.0.0.1", "::1", "localhost"}


def _local_only_page(request: Request, file_name: str) -> FileResponse:
    user = _current_user_from_request(request)
    if not _is_local_request(request) and (not user or user.get("role") != "admin"):
        raise HTTPException(status_code=403, detail="Diese Seite ist nur lokal erreichbar.")
    return FileResponse(STATIC_DIR / file_name)


def _admin_page(request: Request, file_name: str) -> FileResponse | RedirectResponse:
    user = _current_user_from_request(request)
    if not user:
        return RedirectResponse(url="/login", status_code=307)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin-Rechte erforderlich.")
    return FileResponse(STATIC_DIR / file_name)


def _default_page_for_user(user: dict[str, str]) -> str:
    return "/karte" if user.get("role") == "admin" else "/Karte"


def _battlemap_page_response(request: Request) -> FileResponse | RedirectResponse:
    if not _is_local_request(request):
        return FileResponse(STATIC_DIR / "battlemap.html")
    user = _current_user_from_request(request)
    if not user:
        return RedirectResponse(url="/login", status_code=307)
    if user.get("role") in {"admin", "spielleiter"}:
        return FileResponse(STATIC_DIR / "battlemap.html")
    active_surface = list_battlemaps().get("active_surface") or {"kind": "map", "id": ""}
    if str(active_surface.get("kind") or "").strip().lower() != "battlemap":
        return RedirectResponse(url="/Karte", status_code=307)
    return FileResponse(STATIC_DIR / "battlemap.html")


def _resolve_assigned_player(assigned_user_id: str) -> dict[str, str]:
    normalized_id = str(assigned_user_id or "").strip()
    if not normalized_id:
        return {"id": "", "username": ""}
    for user in list_users():
        if user["id"] == normalized_id and user["role"] == "spieler":
            return {"id": user["id"], "username": user["username"]}
    raise HTTPException(status_code=400, detail="Ausgewaehlter Spieler nicht gefunden.")


def _can_move_map_marker(user: dict[str, str], pin: dict[str, object] | None) -> bool:
    if not pin:
        return False
    if user.get("role") in {"spielleiter", "admin"}:
        return True
    if str(pin.get("pin_type") or "pin") != "token":
        return False
    normalized_username = str(user.get("username") or "").strip().lower()
    assigned_user_id = str(pin.get("assigned_user_id") or "")
    assigned_username = str(pin.get("assigned_username") or "")
    if assigned_user_id and user.get("id") == assigned_user_id:
        return True
    if assigned_username and normalized_username == assigned_username.lower():
        return True
    pin_name = str(pin.get("name") or "").strip().lower()
    pin_owner = str(pin.get("username") or "").strip().lower()
    return bool(normalized_username and (normalized_username == pin_name or normalized_username == pin_owner))


def _can_move_map_group(user: dict[str, str], pin: dict[str, object] | None) -> bool:
    if not _can_move_map_marker(user, pin):
        return False
    group_id = str(pin.get("group_id") or "") if pin else ""
    if not group_id or user.get("role") in {"spielleiter", "admin"}:
        return True
    members = get_map_pin_group_members(group_id)
    return bool(members) and all(_can_move_map_marker(user, member) for member in members)


@app.get("/")
async def index(request: Request):
    if _is_local_request(request):
        return RedirectResponse(url="/karte", status_code=307)
    user = _current_user_from_request(request)
    if user:
        return RedirectResponse(url=_default_page_for_user(user), status_code=307)
    return RedirectResponse(url="/login", status_code=307)


@app.get("/chat")
async def chat_page(request: Request):
    return _local_only_page(request, "index.html")


@app.get("/wiki")
async def wiki_page(request: Request):
    return _protected_page(request, "wiki.html")


@app.get("/wiki/{slug}")
async def wiki_detail_page(slug: str, request: Request):
    return _protected_page(request, "wiki.html")


@app.get("/charakterbogen")
async def character_sheet_page(request: Request):
    return _protected_page(request, "charakterbogen.html")


@app.get("/charakter-builder")
async def character_builder_page(request: Request):
    return _protected_page(request, "charakter-builder.html")


@app.get("/Charakterbogen")
async def remote_character_sheet_page(request: Request):
    return _protected_page(request, "charakterbogen.html")


@app.get("/Charakter-Builder")
async def remote_character_builder_page(request: Request):
    return _protected_page(request, "charakter-builder.html")


@app.get("/db")
async def db_page(request: Request):
    return _admin_page(request, "db.html")


@app.get("/projekte/neu")
async def project_setup_page(request: Request):
    return FileResponse(STATIC_DIR / "project-setup.html")


@app.get("/karte")
async def map_page(request: Request):
    return _local_only_page(request, "map.html")


@app.get("/battlemap")
async def battlemap_page(request: Request):
    return _battlemap_page_response(request)


@app.get("/Battlemap")
async def remote_battlemap_page(request: Request):
    return _battlemap_page_response(request)


@app.get("/login")
async def login_page(request: Request):
    user = _current_user_from_request(request)
    if user:
        return RedirectResponse(url=_default_page_for_user(user), status_code=307)
    return FileResponse(STATIC_DIR / "login.html")


@app.get("/Eldran")
async def eldran_page(request: Request):
    return _protected_page(request, "eldran.html")


@app.get("/Karte")
async def remote_map_page(request: Request):
    return _protected_page(request, "remote-map.html")


@app.get("/eldran")
@app.get("/remote")
async def legacy_eldran_page():
    return RedirectResponse(url="/Eldran", status_code=307)


@app.get("/api/health")
async def health():
    projects_payload = list_projects()
    return {
        "status": "ok",
        "agent_name": AGENT_NAME,
        "ollama_url": OLLAMA_URL,
        "model": OLLAMA_MODEL,
        "default_temperature": DEFAULT_TEMPERATURE,
        "import_folder_path": get_setting("import_folder_path", ""),
        "active_project_id": projects_payload["active_project_id"],
    }


@app.get("/api/projects")
async def projects_endpoint(request: Request):
    user = _require_user(request)
    return list_projects(user)


@app.post("/api/projects")
async def create_project_endpoint(request: Request, payload: CreateProjectRequest):
    user = _require_spielleiter_or_admin(request)
    try:
        project = create_project(payload.name, user, payload.ruleset)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"project": project}


@app.post("/api/projects/setup")
async def setup_project_endpoint(request: Request, payload: SetupProjectRequest):
    user = _require_spielleiter_or_admin(request)
    try:
        project = create_project(payload.name, user, payload.ruleset)
        set_active_project(project["id"], user)
        assigned_players = []
        seen_player_ids = set()
        for player_id in payload.player_ids:
            normalized_player_id = str(player_id or "").strip()
            if not normalized_player_id or normalized_player_id in seen_player_ids:
                continue
            seen_player_ids.add(normalized_player_id)
            set_project_player_assignment(project["id"], normalized_player_id, True, user)
            assigned_players.append(normalized_player_id)
        created_map = await create_map(payload.map_name, None) if payload.create_empty_map else None
        if created_map:
            set_active_map(created_map["id"])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"project": project, "assigned_player_ids": assigned_players, "map": created_map}


@app.patch("/api/projects/current")
async def set_active_project_endpoint(request: Request, payload: SetActiveProjectRequest):
    user = _require_spielleiter_or_admin(request)
    try:
        project = set_active_project(payload.project_id, user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"project": project}


@app.get("/api/projects/{project_id}/players")
async def project_players_endpoint(project_id: str, request: Request):
    user = _require_spielleiter_or_admin(request)
    try:
        players = list_project_players(project_id, user)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"players": players}


@app.patch("/api/projects/{project_id}/players")
async def project_player_assignment_endpoint(project_id: str, request: Request, payload: ProjectPlayerAssignmentRequest):
    user = _require_spielleiter_or_admin(request)
    try:
        result = set_project_player_assignment(project_id, payload.user_id, payload.assigned, user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return result


@app.get("/api/character-sheets")
async def character_sheets_endpoint(request: Request, project_id: str = ""):
    user = _require_user(request)
    try:
        return list_character_sheets(project_id=project_id, acting_user=user)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/character-sheets/{user_id}")
async def character_sheet_endpoint(user_id: str, request: Request, project_id: str = ""):
    user = _require_user(request)
    try:
        return get_character_sheet(user_id, project_id=project_id, acting_user=user)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.put("/api/character-sheets/{user_id}")
async def save_character_sheet_endpoint(user_id: str, request: Request, payload: CharacterSheetUpdateRequest):
    user = _require_user(request)
    try:
        return save_character_sheet(user_id, payload.data, project_id=payload.project_id, acting_user=user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/character-sheets/{user_id}/pdf")
async def upload_character_sheet_pdf_endpoint(
    user_id: str,
    request: Request,
    pdf: UploadFile = File(...),
    project_id: str = Form(""),
):
    user = _require_user(request)
    try:
        return await save_character_sheet_pdf(user_id, pdf, project_id=project_id, acting_user=user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/character-sheets/{user_id}/pdf")
async def character_sheet_pdf_endpoint(user_id: str, request: Request, project_id: str = ""):
    user = _require_user(request)
    try:
        pdf_path, original_name = get_character_sheet_pdf_path(user_id, project_id=project_id, acting_user=user)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=original_name,
        content_disposition_type="inline",
    )


@app.delete("/api/character-sheets/{user_id}/pdf")
async def delete_character_sheet_pdf_endpoint(user_id: str, request: Request, project_id: str = ""):
    user = _require_user(request)
    try:
        return delete_character_sheet_pdf(user_id, project_id=project_id, acting_user=user)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/auth/me")
async def auth_me(request: Request):
    return {"user": _require_user(request), "is_local": _is_local_request(request)}


@app.post("/api/auth/register")
async def auth_register(payload: RegisterRequest, request: Request):
    _require_local_admin(request)
    if payload.password != payload.password_confirm:
        raise HTTPException(status_code=400, detail="Passwort-Bestaetigung stimmt nicht ueberein.")
    try:
        user = create_user(payload.username, payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"user": user}


@app.post("/api/auth/login")
async def auth_login(payload: LoginRequest, request: Request):
    user = authenticate_user(payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Login fehlgeschlagen.")

    token = create_user_session(user["id"])
    redirect_to = _default_page_for_user(user) if _is_local_request(request) else "/Karte"
    return {"user": user, "token": token, "redirect_to": redirect_to}


@app.post("/api/auth/logout")
async def auth_logout(request: Request):
    auth_header = str(request.headers.get("authorization") or "").strip()
    token = auth_header[7:].strip() if auth_header.lower().startswith("bearer ") else ""
    if token:
        delete_user_session(token)
    response = JSONResponse({"logged_out": True})
    response.delete_cookie(SESSION_COOKIE_NAME)
    return response


@app.get("/api/users")
async def users(request: Request):
    _require_admin(request)
    return {"users": list_users()}


@app.post("/api/users")
async def create_user_endpoint(request: Request, payload: CreateUserRequest):
    _require_local_admin(request)
    if payload.password != payload.password_confirm:
        raise HTTPException(status_code=400, detail="Passwort-Bestaetigung stimmt nicht ueberein.")
    try:
        user = create_user(payload.username, payload.password)
        if payload.role != user["role"]:
            user = update_user_role(user["id"], payload.role)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"user": user}


@app.patch("/api/users/{user_id}/role")
async def update_user_role_endpoint(user_id: str, request: Request, payload: UpdateUserRoleRequest):
    _require_admin(request)
    try:
        user = update_user_role(user_id, payload.role)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"user": user}


@app.get("/api/files")
async def files():
    return {"files": list_uploads()}


@app.get("/api/wiki/pages")
async def wiki_pages_endpoint(request: Request):
    _require_user(request)
    return {"pages": list_wiki_pages()}


@app.get("/api/wiki/pages/{slug}")
async def wiki_page_endpoint(slug: str, request: Request):
    _require_user(request)
    page = get_wiki_page(slug)
    if not page:
        raise HTTPException(status_code=404, detail="Wiki-Seite nicht gefunden.")
    return page


@app.get("/api/music-state")
async def music_state_endpoint(request: Request):
    _require_user(request)
    return get_music_state()


@app.get("/api/music-tracks")
async def music_tracks_endpoint(request: Request):
    _require_user(request)
    return {"tracks": list_music_tracks()}


@app.post("/api/music-track")
async def upload_music_track_endpoint(request: Request, file: UploadFile = File(...)):
    user = _require_spielleiter_or_admin(request)
    try:
        return await _save_music_track(file, user.get("username", ""))
    finally:
        await file.close()


async def _save_music_track(file: UploadFile, requested_by: str):
    try:
        return save_music_track(file, requested_by=requested_by)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/music-track/select")
async def select_music_track_endpoint(request: Request, payload: MusicTrackSelectRequest):
    user = _require_spielleiter_or_admin(request)
    try:
        return select_music_track(payload.track_id, requested_by=user.get("username", ""))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.delete("/api/music-state")
async def clear_music_state_endpoint(request: Request):
    user = _require_spielleiter_or_admin(request)
    return clear_music_state(requested_by=user.get("username", ""))


@app.patch("/api/music-state")
async def update_music_playback_endpoint(request: Request, payload: MusicPlaybackRequest):
    user = _require_spielleiter_or_admin(request)
    try:
        return update_music_playback(
            requested_by=user.get("username", ""),
            is_playing=payload.is_playing,
            position_seconds=payload.position_seconds,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/map-sound-cue")
async def map_sound_cue_endpoint(request: Request):
    _require_user(request)
    return get_map_sound_cue()


@app.post("/api/map-sound-cue/{pin_id}")
async def trigger_map_sound_cue_endpoint(pin_id: str, request: Request):
    user = _require_spielleiter_or_admin(request)
    try:
        return trigger_map_sound_cue(pin_id, requested_by=user.get("username", ""))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/map-sound-cue/{cue_id}/complete")
async def complete_map_sound_cue_endpoint(cue_id: str, request: Request):
    user = _require_spielleiter_or_admin(request)
    return complete_map_sound_cue(cue_id, requested_by=user.get("username", ""))


@app.get("/api/music-file/{file_name}")
async def music_file_endpoint(file_name: str, request: Request):
    _require_user(request)
    file_path = get_music_file_path(file_name)
    if not file_path:
        raise HTTPException(status_code=404, detail="Audiodatei nicht gefunden.")
    media_type, _ = mimetypes.guess_type(file_path.name)
    return FileResponse(file_path, media_type=media_type or "application/octet-stream")


@app.get("/api/map-image/meta")
async def map_image_meta(map_id: str = "", layer_id: str = ""):
    maps_payload = list_maps()
    return {
        "image": get_map_image_info(map_id or None, layer_id or None),
        "active_map_id": maps_payload["active_map_id"],
    }


@app.get("/api/maps")
async def maps(request: Request):
    _require_user(request)
    return list_maps()


@app.get("/api/maps/{map_id}/layers")
async def map_layers(map_id: str, request: Request):
    _require_user(request)
    try:
        return list_map_layers(map_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/maps/{map_id}/layers/{layer_id}/fog")
async def map_layer_fog_endpoint(map_id: str, layer_id: str, request: Request):
    _require_user(request)
    try:
        return get_map_layer_fog(map_id, layer_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.patch("/api/maps/{map_id}/layers/{layer_id}/fog")
async def update_map_layer_fog_endpoint(map_id: str, layer_id: str, request: Request, payload: MapLayerFogRequest):
    _require_spielleiter_or_admin(request)
    try:
        return update_map_layer_fog(
            map_id,
            layer_id,
            enabled=payload.enabled,
            explored_areas=payload.explored_areas,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/maps/{map_id}/layers/{layer_id}/fog/walls")
async def add_map_layer_fog_wall_endpoint(map_id: str, layer_id: str, request: Request, payload: MapFogWallRequest):
    _require_spielleiter_or_admin(request)
    try:
        wall = add_map_layer_fog_wall(map_id, layer_id, payload.x1, payload.y1, payload.x2, payload.y2)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"wall": wall}


@app.post("/api/maps/{map_id}/layers/{layer_id}/fog/doors")
async def add_map_layer_fog_door_endpoint(map_id: str, layer_id: str, request: Request, payload: MapFogWallRequest):
    _require_spielleiter_or_admin(request)
    try:
        door = add_map_layer_fog_door(map_id, layer_id, payload.x1, payload.y1, payload.x2, payload.y2)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"door": door}


@app.patch("/api/maps/{map_id}/layers/{layer_id}/fog/doors/{door_id}")
async def update_map_layer_fog_door_endpoint(
    map_id: str,
    layer_id: str,
    door_id: str,
    request: Request,
    payload: MapFogDoorUpdateRequest,
):
    _require_spielleiter_or_admin(request)
    door = update_map_layer_fog_door(map_id, layer_id, door_id, is_open=payload.is_open)
    if not door:
        raise HTTPException(status_code=404, detail="Tuer nicht gefunden.")
    return {"door": door}


@app.delete("/api/maps/{map_id}/layers/{layer_id}/fog/walls/{wall_id}")
async def delete_map_layer_fog_wall_endpoint(map_id: str, layer_id: str, wall_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    deleted = delete_map_layer_fog_wall(map_id, layer_id, wall_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Sichtblocker nicht gefunden.")
    return {"deleted": True, "wall_id": wall_id}


@app.delete("/api/maps/{map_id}/layers/{layer_id}/fog/doors/{door_id}")
async def delete_map_layer_fog_door_endpoint(map_id: str, layer_id: str, door_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    deleted = delete_map_layer_fog_door(map_id, layer_id, door_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tuer nicht gefunden.")
    return {"deleted": True, "door_id": door_id}


@app.get("/api/battlemaps")
async def battlemaps(request: Request):
    _require_user(request)
    return list_battlemaps()


@app.get("/api/battlemaps/{battlemap_id}")
async def battlemap_detail(battlemap_id: str, request: Request):
    user = _require_user(request)
    battlemap = get_battlemap(battlemap_id)
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    battlemap = filter_battlemap_for_visibility(
        battlemap,
        include_gm_layer=user.get("role") in {"spielleiter", "admin"},
    )
    return {"battlemap": battlemap}


@app.post("/api/maps")
async def create_map_endpoint(
    request: Request,
    name: str = Form(...),
    background_color: str = Form("#223044"),
    canvas_width: int = Form(4096),
    canvas_height: int = Form(4096),
    image: UploadFile | None = File(default=None),
):
    _require_spielleiter_or_admin(request)
    try:
        created = await create_map(name, image, background_color, canvas_width, canvas_height)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        if image:
            await image.close()
    return {"map": created}


@app.post("/api/maps/{map_id}/layers")
async def create_map_layer_endpoint(
    map_id: str,
    request: Request,
    name: str = Form(...),
    background_color: str = Form("#223044"),
    canvas_width: int = Form(4096),
    canvas_height: int = Form(4096),
    image: UploadFile | None = File(default=None),
):
    _require_spielleiter_or_admin(request)
    try:
        created = await create_map_layer(name, map_id, image, background_color, canvas_width, canvas_height)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        if image:
            await image.close()
    return {"layer": created}


@app.patch("/api/maps/{map_id}/layers/{layer_id}")
async def rename_map_layer_endpoint(map_id: str, layer_id: str, request: Request, payload: RenameMapLayerRequest):
    _require_spielleiter_or_admin(request)
    try:
        updated = rename_map_layer(map_id, layer_id, payload.name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"layer": updated}


@app.post("/api/battlemaps")
async def create_battlemap_endpoint(
    request: Request,
    name: str = Form(...),
    grid_width: int = Form(12),
    grid_height: int = Form(8),
    cell_size: int = Form(64),
    scale_percent: int = Form(100),
    obstacle_color: str = Form("#7f858c"),
    background: UploadFile | None = File(default=None),
):
    _require_spielleiter_or_admin(request)
    try:
        created = await create_battlemap(name, grid_width, grid_height, cell_size, scale_percent, obstacle_color, background)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        if background:
            await background.close()
    return {"battlemap": created}


@app.patch("/api/maps/{map_id}/activate")
async def activate_map_endpoint(map_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    active_map = set_active_map(map_id)
    if not active_map:
        raise HTTPException(status_code=404, detail="Karte nicht gefunden.")
    return {"map": active_map}


@app.patch("/api/battlemaps/{battlemap_id}/activate")
async def activate_battlemap_endpoint(battlemap_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    active_battlemap = set_active_battlemap(battlemap_id)
    if not active_battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": active_battlemap}


@app.patch("/api/live-surface/map")
async def activate_live_map_surface_endpoint(request: Request):
    _require_spielleiter_or_admin(request)
    active_map = activate_current_map_surface()
    if not active_map:
        raise HTTPException(status_code=404, detail="Karte nicht gefunden.")
    return {"map": active_map}


@app.patch("/api/maps/{map_id}")
async def rename_map_endpoint(map_id: str, request: Request, payload: RenameMapRequest):
    _require_spielleiter_or_admin(request)
    try:
        updated_map = rename_map(map_id, payload.name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not updated_map:
        raise HTTPException(status_code=404, detail="Karte nicht gefunden.")
    return {"map": updated_map}


@app.patch("/api/battlemaps/{battlemap_id}")
async def update_battlemap_endpoint(battlemap_id: str, request: Request, payload: BattlemapConfigRequest):
    _require_spielleiter_or_admin(request)
    try:
        battlemap = update_battlemap_config(
            battlemap_id,
            payload.name,
            payload.grid_width,
            payload.grid_height,
            payload.cell_size,
            payload.scale_percent,
            payload.obstacle_color,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.post("/api/battlemaps/{battlemap_id}/background")
async def update_battlemap_background_endpoint(
    battlemap_id: str,
    request: Request,
    background: UploadFile | None = File(default=None),
):
    _require_spielleiter_or_admin(request)
    if not background:
        raise HTTPException(status_code=400, detail="Hintergrundbild fehlt.")
    battlemap = None
    try:
        battlemap = await save_battlemap_background(battlemap_id, background)
    finally:
        await background.close()
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.patch("/api/battlemaps/{battlemap_id}/obstacles")
async def update_battlemap_obstacles_endpoint(
    battlemap_id: str,
    request: Request,
    payload: BattlemapObstacleRequest,
):
    _require_spielleiter_or_admin(request)
    battlemap = update_battlemap_obstacles(battlemap_id, payload.obstacles)
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.patch("/api/battlemaps/{battlemap_id}/fog")
async def update_battlemap_fog_endpoint(
    battlemap_id: str,
    request: Request,
    payload: BattlemapFogRequest,
):
    _require_spielleiter_or_admin(request)
    battlemap = update_battlemap_fog(battlemap_id, enabled=payload.enabled)
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.post("/api/battlemaps/{battlemap_id}/fog/walls")
async def add_battlemap_fog_wall_endpoint(
    battlemap_id: str,
    request: Request,
    payload: BattlemapFogSegmentRequest,
):
    _require_spielleiter_or_admin(request)
    try:
        battlemap = add_battlemap_fog_wall(
            battlemap_id,
            x1=payload.x1,
            y1=payload.y1,
            x2=payload.x2,
            y2=payload.y2,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.post("/api/battlemaps/{battlemap_id}/fog/doors")
async def add_battlemap_fog_door_endpoint(
    battlemap_id: str,
    request: Request,
    payload: BattlemapFogSegmentRequest,
):
    _require_spielleiter_or_admin(request)
    try:
        battlemap = add_battlemap_fog_door(
            battlemap_id,
            x1=payload.x1,
            y1=payload.y1,
            x2=payload.x2,
            y2=payload.y2,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.patch("/api/battlemaps/{battlemap_id}/fog/doors/{door_id}")
async def update_battlemap_fog_door_endpoint(
    battlemap_id: str,
    door_id: str,
    request: Request,
    payload: BattlemapFogDoorUpdateRequest,
):
    _require_spielleiter_or_admin(request)
    battlemap = update_battlemap_fog_door(battlemap_id, door_id, is_open=payload.is_open)
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap oder Tuer nicht gefunden.")
    return {"battlemap": battlemap}


@app.delete("/api/battlemaps/{battlemap_id}/fog/{element_type}")
async def delete_battlemap_fog_segment_endpoint(
    battlemap_id: str,
    element_type: str,
    request: Request,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
):
    _require_spielleiter_or_admin(request)
    try:
        battlemap = delete_battlemap_fog_segment(
            battlemap_id,
            element_type=element_type,
            x1=x1,
            y1=y1,
            x2=x2,
            y2=y2,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.delete("/api/battlemaps/{battlemap_id}/fog/elements/last")
async def delete_last_battlemap_fog_element_endpoint(
    battlemap_id: str,
    request: Request,
    element_type: str = "",
):
    _require_spielleiter_or_admin(request)
    battlemap = delete_last_battlemap_fog_element(battlemap_id, element_type=element_type)
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.post("/api/battlemaps/{battlemap_id}/tokens")
async def add_battlemap_token_endpoint(
    battlemap_id: str,
    request: Request,
    payload: BattlemapTokenCreateRequest,
):
    _require_spielleiter_or_admin(request)
    assigned_player = _resolve_assigned_player(payload.assigned_user_id) if payload.type == "player" else {"id": "", "username": ""}
    try:
        battlemap = add_battlemap_token(
            battlemap_id,
            payload.name,
            payload.type,
            payload.x,
            payload.y,
            payload.color,
            payload.initiative,
            payload.move_range,
            payload.attack_range,
            payload.vision_range,
            assigned_player["id"],
            assigned_player["username"],
            payload.visibility_layer,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap nicht gefunden.")
    return {"battlemap": battlemap}


@app.patch("/api/battlemaps/{battlemap_id}/tokens/{token_id}")
async def update_battlemap_token_endpoint(
    battlemap_id: str,
    token_id: str,
    request: Request,
    payload: BattlemapTokenUpdateRequest,
):
    _require_spielleiter_or_admin(request)
    resolved_assigned_player = None
    if payload.assigned_user_id is not None:
        token_type = payload.type
        if token_type is None:
            existing_battlemap = get_battlemap(battlemap_id) or {}
            token = next((item for item in list(existing_battlemap.get("tokens") or []) if str(item.get("id") or "") == token_id), None)
            token_type = str(token.get("type") or "player") if token else "player"
        resolved_assigned_player = _resolve_assigned_player(payload.assigned_user_id) if token_type == "player" else {"id": "", "username": ""}
    try:
        battlemap = update_battlemap_token(
            battlemap_id,
            token_id,
            x=payload.x,
            y=payload.y,
            name=payload.name,
            token_type=payload.type,
            color=payload.color,
            initiative=payload.initiative,
            move_range=payload.move_range,
            attack_range=payload.attack_range,
            vision_range=payload.vision_range,
            assigned_user_id=resolved_assigned_player["id"] if resolved_assigned_player is not None else None,
            assigned_username=resolved_assigned_player["username"] if resolved_assigned_player is not None else None,
            visibility_layer=payload.visibility_layer,
            ignore_turn_rules=payload.ignore_turn_rules,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap oder Token nicht gefunden.")
    return {"battlemap": battlemap}


@app.delete("/api/battlemaps/{battlemap_id}/tokens/{token_id}")
async def delete_battlemap_token_endpoint(battlemap_id: str, token_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    battlemap = delete_battlemap_token(battlemap_id, token_id)
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap oder Token nicht gefunden.")
    return {"battlemap": battlemap}


@app.post("/api/battlemaps/{battlemap_id}/tokens/{token_id}/image")
async def update_battlemap_token_image_endpoint(
    battlemap_id: str,
    token_id: str,
    request: Request,
    image: UploadFile | None = File(default=None),
):
    _require_spielleiter_or_admin(request)
    if not image:
        raise HTTPException(status_code=400, detail="Token-Bild fehlt.")
    battlemap = None
    try:
        battlemap = await save_battlemap_token_image(battlemap_id, token_id, image)
    finally:
        await image.close()
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap oder Token nicht gefunden.")
    return {"battlemap": battlemap}


@app.get("/api/battlemaps/tokens/{token_id}/image")
async def battlemap_token_image(token_id: str, request: Request):
    _require_user(request)
    image_path = get_battlemap_token_image_path(token_id)
    if not image_path:
        raise HTTPException(status_code=404, detail="Token-Bild nicht gefunden.")
    return FileResponse(image_path)


@app.post("/api/battlemaps/{battlemap_id}/tokens/{token_id}/end-turn")
async def end_battlemap_token_turn_endpoint(battlemap_id: str, token_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    try:
        battlemap = end_battlemap_token_turn(battlemap_id, token_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not battlemap:
        raise HTTPException(status_code=404, detail="Battlemap oder Token nicht gefunden.")
    return {"battlemap": battlemap}


@app.delete("/api/maps/{map_id}")
async def delete_map_endpoint(map_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    try:
        deleted = delete_map(map_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not deleted:
        raise HTTPException(status_code=404, detail="Karte nicht gefunden.")
    return deleted


@app.get("/api/map-drawings")
async def map_drawings(request: Request, map_id: str = "", layer_id: str = ""):
    _require_user(request)
    return get_map_drawings(map_id or None, layer_id or None)


@app.get("/api/map-pings")
async def map_pings(request: Request, map_id: str = "", layer_id: str = ""):
    _require_user(request)
    return get_map_pings(map_id or None, layer_id or None)


@app.get("/api/map-pins")
async def map_pins(request: Request, map_id: str = "", layer_id: str = "", show_gm_layer: bool = True):
    user = _require_user(request)
    can_see_gm_layer = user.get("role") in {"spielleiter", "admin"}
    return get_map_pins(
        map_id or None,
        include_hidden=can_see_gm_layer,
        include_gm_layer=can_see_gm_layer and show_gm_layer,
        layer_id=layer_id or None,
        current_user_id=user.get("id", ""),
        current_username=user.get("username", ""),
        current_role=user.get("role", ""),
    )


@app.get("/api/map-token-users")
async def map_token_users(request: Request):
    _require_spielleiter_or_admin(request)
    return {"users": [user for user in list_users() if user["role"] == "spieler"]}


@app.get("/api/map-overlays")
async def map_overlays(request: Request, map_id: str = "", layer_id: str = "", show_gm_layer: bool = True):
    user = _require_user(request)
    return get_map_overlays(
        map_id or None,
        layer_id or None,
        include_gm_layer=user.get("role") in {"spielleiter", "admin"} and show_gm_layer,
    )


@app.get("/api/map-image")
async def map_image(layer_id: str = ""):
    image_path = get_map_image_path(layer_id=layer_id or None)
    if not image_path:
        raise HTTPException(status_code=404, detail="Es ist noch kein Kartenbild vorhanden.")
    return FileResponse(image_path)


@app.get("/api/map-image/{map_id}")
async def map_image_by_id(map_id: str, layer_id: str = ""):
    image_path = get_map_image_path(map_id, layer_id or None)
    if not image_path:
        raise HTTPException(status_code=404, detail="Es ist noch kein Kartenbild vorhanden.")
    return FileResponse(image_path)


@app.get("/api/battlemaps/{battlemap_id}/background")
async def battlemap_background(battlemap_id: str, request: Request):
    _require_user(request)
    image_path = get_battlemap_background_path(battlemap_id)
    if not image_path:
        raise HTTPException(status_code=404, detail="Es ist noch kein Battlemap-Hintergrund vorhanden.")
    return FileResponse(image_path)


@app.get("/api/map-pin-image/{image_name}")
async def map_pin_image(image_name: str, request: Request):
    _require_user(request)
    image_path = get_map_pin_image_path(image_name)
    if not image_path:
        raise HTTPException(status_code=404, detail="Pin-Bild nicht gefunden.")
    return FileResponse(image_path)


@app.get("/api/map-pin-sound/{sound_name}")
async def map_pin_sound(sound_name: str, request: Request):
    _require_user(request)
    sound_path = get_map_pin_sound_path(sound_name)
    if not sound_path:
        raise HTTPException(status_code=404, detail="Sound nicht gefunden.")
    media_type, _ = mimetypes.guess_type(sound_path.name)
    return FileResponse(sound_path, media_type=media_type or "application/octet-stream")


@app.get("/api/map-overlay-image/{image_name}")
async def map_overlay_image(image_name: str, request: Request):
    _require_user(request)
    image_path = get_map_overlay_image_path(image_name)
    if not image_path:
        raise HTTPException(status_code=404, detail="Overlay-Bild nicht gefunden.")
    return FileResponse(image_path)


@app.get("/api/command-chat")
async def command_chat_messages(request: Request):
    user = _require_user(request)
    return {"messages": list_command_messages(user.get("username", ""), user.get("role", ""))}


@app.post("/api/command-chat")
async def command_chat_post(request: Request, payload: CommandChatRequest):
    user = _require_user(request)
    try:
        messages = add_command_message(user["username"], payload.message, user.get("role", ""))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"messages": messages}


@app.delete("/api/command-chat")
async def command_chat_clear(request: Request):
    _require_spielleiter_or_admin(request)
    clear_command_messages()
    return {"cleared": True}


@app.post("/api/map-drawings")
async def add_map_stroke(request: Request, payload: MapStrokeRequest, map_id: str = ""):
    user = _require_user(request)
    layer_id = request.query_params.get("layer_id", "")
    try:
        stroke = add_map_drawing_stroke(
            user["username"],
            payload.color,
            payload.width,
            [point.model_dump() for point in payload.points],
            map_id or None,
            layer_id or None,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"stroke": stroke}


@app.post("/api/map-pings")
async def add_map_ping_endpoint(request: Request, payload: MapPingRequest, map_id: str = ""):
    user = _require_user(request)
    layer_id = request.query_params.get("layer_id", "")
    ping = add_map_ping(user["username"], payload.color, payload.x, payload.y, map_id or None, layer_id or None)
    return {"ping": ping}


@app.post("/api/map-pins")
async def add_map_pin_endpoint(
    request: Request,
    name: str = Form(...),
    description: str = Form(""),
    pin_type: str = Form("pin"),
    assigned_user_id: str = Form(""),
    target_kind: str = Form(""),
    target_id: str = Form(""),
    show_label: bool = Form(True),
    hidden_from_players: bool = Form(False),
    visibility_layer: str = Form(""),
    vision_radius: float = Form(0.18),
    x: float = Form(...),
    y: float = Form(...),
    map_id: str = Form(""),
    layer_id: str = Form(""),
    image: UploadFile | None = File(default=None),
    sound: UploadFile | None = File(default=None),
):
    user = _require_spielleiter_or_admin(request)
    assigned_player = _resolve_assigned_player(assigned_user_id) if pin_type == "token" else {"id": "", "username": ""}
    try:
        pin = await save_map_pin(
            user["username"],
            name,
            description,
            x,
            y,
            image,
            show_label,
            hidden_from_players,
            visibility_layer or None,
            pin_type,
            assigned_player["id"],
            assigned_player["username"],
            target_kind,
            target_id,
            sound,
            map_id or None,
            layer_id or None,
            vision_radius,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        if image:
            await image.close()
        if sound:
            await sound.close()
    return {"pin": pin}


@app.delete("/api/map-pins/{pin_id}")
async def delete_map_pin_endpoint(pin_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    deleted = delete_map_pin(pin_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Pin nicht gefunden.")
    return {"deleted": True, "pin_id": pin_id}


@app.patch("/api/map-pins/{pin_id}/position")
async def update_map_pin_position_endpoint(pin_id: str, request: Request, payload: MapPinPositionRequest):
    user = _require_user(request)
    existing = get_map_pin(pin_id)
    if not _can_move_map_group(user, existing):
        raise HTTPException(status_code=403, detail="Du darfst diesen Marker nicht bewegen.")
    pin = update_map_pin_position(pin_id, payload.x, payload.y)
    if not pin:
        raise HTTPException(status_code=404, detail="Pin nicht gefunden.")
    return {"pin": pin}


@app.post("/api/map-tokens/group")
async def group_map_tokens_endpoint(request: Request, payload: MapTokenGroupRequest):
    _require_spielleiter_or_admin(request)
    try:
        result = group_map_tokens(payload.token_ids)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return result


@app.post("/api/map-tokens/ungroup")
async def ungroup_map_tokens_endpoint(request: Request, payload: MapTokenGroupRequest):
    _require_spielleiter_or_admin(request)
    try:
        result = ungroup_map_tokens(payload.token_ids)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return result


@app.post("/api/map-pins/{pin_id}")
async def update_map_pin_endpoint(
    pin_id: str,
    request: Request,
    name: str = Form(...),
    description: str = Form(""),
    pin_type: str = Form("pin"),
    assigned_user_id: str = Form(""),
    target_kind: str = Form(""),
    target_id: str = Form(""),
    show_label: bool = Form(True),
    hidden_from_players: bool = Form(False),
    visibility_layer: str = Form(""),
    vision_radius: float = Form(0.18),
    image: UploadFile | None = File(default=None),
    sound: UploadFile | None = File(default=None),
):
    _require_spielleiter_or_admin(request)
    assigned_player = _resolve_assigned_player(assigned_user_id) if pin_type == "token" else {"id": "", "username": ""}
    try:
        pin = await update_map_pin_details(
            pin_id,
            name,
            description,
            show_label,
            hidden_from_players,
            visibility_layer or None,
            pin_type,
            assigned_player["id"],
            assigned_player["username"],
            target_kind,
            target_id,
            vision_radius,
            image,
            sound,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        if image:
            await image.close()
        if sound:
            await sound.close()
    if not pin:
        raise HTTPException(status_code=404, detail="Pin nicht gefunden.")
    return {"pin": pin}


@app.patch("/api/map-pins/{pin_id}/visibility")
async def update_map_pin_visibility_endpoint(pin_id: str, request: Request, payload: VisibilityLayerRequest):
    _require_spielleiter_or_admin(request)
    pin = update_map_pin_visibility_layer(pin_id, payload.visibility_layer)
    if not pin:
        raise HTTPException(status_code=404, detail="Pin nicht gefunden.")
    return {"pin": pin}


@app.post("/api/map-overlays")
async def add_map_overlay_endpoint(
    request: Request,
    x: float = Form(...),
    y: float = Form(...),
    width: float = Form(...),
    height: float = Form(...),
    visibility_layer: str = Form("public"),
    map_id: str = Form(""),
    layer_id: str = Form(""),
    image: UploadFile | None = File(default=None),
):
    user = _require_spielleiter_or_admin(request)
    try:
        overlay = await save_map_overlay(user["username"], image, x, y, width, height, visibility_layer, map_id or None, layer_id or None)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        if image:
            await image.close()
    return {"overlay": overlay}


@app.patch("/api/map-overlays/{overlay_id}/geometry")
async def update_map_overlay_geometry_endpoint(overlay_id: str, request: Request, payload: MapOverlayGeometryRequest):
    _require_spielleiter_or_admin(request)
    overlay = update_map_overlay_geometry(overlay_id, payload.x, payload.y, payload.width, payload.height)
    if not overlay:
        raise HTTPException(status_code=404, detail="Overlay nicht gefunden.")
    return {"overlay": overlay}


@app.patch("/api/map-overlays/{overlay_id}/visibility")
async def update_map_overlay_visibility_endpoint(overlay_id: str, request: Request, payload: VisibilityLayerRequest):
    _require_spielleiter_or_admin(request)
    overlay = update_map_overlay_visibility_layer(overlay_id, payload.visibility_layer)
    if not overlay:
        raise HTTPException(status_code=404, detail="Overlay nicht gefunden.")
    return {"overlay": overlay}


@app.delete("/api/map-overlays/{overlay_id}")
async def delete_map_overlay_endpoint(overlay_id: str, request: Request):
    _require_spielleiter_or_admin(request)
    deleted = delete_map_overlay(overlay_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Overlay nicht gefunden.")
    return {"deleted": True, "overlay_id": overlay_id}


@app.delete("/api/map-drawings")
async def delete_map_drawings(request: Request, map_id: str = "", layer_id: str = ""):
    _require_spielleiter_or_admin(request)
    clear_map_drawings(map_id or None, layer_id or None)
    return {"cleared": True}


@app.post("/api/map-drawings/undo")
async def undo_map_drawing(request: Request, map_id: str = "", layer_id: str = ""):
    user = _require_user(request)
    stroke = undo_last_map_drawing_stroke(user["username"], map_id or None, layer_id or None)
    if not stroke:
        return {"undone": False}
    return {"undone": True, "stroke": stroke}


@app.get("/api/chats")
async def chats(scope: str = "local", client_id: str = ""):
    return {"chats": list_chats(scope=scope, client_id=client_id)}


@app.post("/api/chats")
async def create_chat_endpoint(request: CreateChatRequest):
    return create_chat(request.title, scope=request.chat_scope, client_id=request.client_id)


@app.get("/api/chats/{chat_id}")
async def chat_detail(chat_id: str, scope: str = "local", client_id: str = ""):
    chat = get_chat(chat_id, scope=scope, client_id=client_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat nicht gefunden.")
    return chat


@app.delete("/api/chats/{chat_id}")
async def delete_chat_endpoint(chat_id: str, scope: str = "local", client_id: str = ""):
    deleted = delete_chat(chat_id, scope=scope, client_id=client_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Chat nicht gefunden.")
    return {"deleted": True, "chat_id": chat_id}


@app.post("/api/files")
async def upload_file(file: UploadFile = File(...)):
    try:
        saved = await save_upload(file)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        await file.close()

    return saved


@app.post("/api/map-image")
async def upload_map_image(
    request: Request,
    file: UploadFile = File(...),
    map_id: str = Form(""),
    layer_id: str = Form(""),
):
    _require_spielleiter_or_admin(request)
    try:
        saved = await save_map_image(file, map_id=map_id or None, layer_id=layer_id or None)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        await file.close()

    return saved


@app.post("/api/import-folder")
async def import_folder_endpoint(request: FolderImportRequest):
    try:
        result = import_folder(request.folder_path)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return result


@app.post("/api/import-folder/reload")
async def reload_imported_folder():
    folder_path = get_setting("import_folder_path", "")
    if not folder_path:
        raise HTTPException(status_code=400, detail="Es ist noch kein Import-Ordner gespeichert.")
    try:
        result = import_folder(folder_path)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return result


@app.post("/api/files/reindex")
async def reindex_files():
    try:
        updated = reindex_uploads()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"updated": updated}


@app.get("/api/db/tables")
async def db_tables(request: Request):
    _require_admin(request)
    return {"tables": list_tables()}


@app.post("/api/db/query")
async def db_query(payload: SqlQueryRequest, request: Request):
    _require_admin(request)
    try:
        return run_sql_query(payload.query, allow_write=True)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        history = (
            get_chat_history(request.chat_id, scope=request.chat_scope, client_id=request.client_id)
            if request.chat_id
            else [message.model_dump() for message in request.history]
        )
        file_context, sources = build_context(request.message, request.file_ids)
        message = request.message
        if file_context:
            message = (
                "Nutze ausschliesslich die folgenden relevanten Dokumentabschnitte als Kontext. "
                "Wenn die Informationen nicht ausreichen oder nicht eindeutig sind, sage das klar. "
                "Nenne in deiner Antwort nach Moeglichkeit die verwendeten Quellenlabels.\n\n"
                f"{file_context}\n\n"
                f"Benutzeranfrage: {request.message}"
            )
        else:
            sources = []
        response = ask_eldran(message, history=history, temperature=request.temperature)
        saved_chat = save_chat_exchange(
            chat_id=request.chat_id,
            user_message=request.message,
            assistant_message=response,
            sources=sources,
            scope=request.chat_scope,
            client_id=request.client_id,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"response": response, "sources": sources, "chat_id": saved_chat["chat_id"], "chat_title": saved_chat["title"]}
