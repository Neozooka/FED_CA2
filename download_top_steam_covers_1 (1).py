#!/usr/bin/env python3
"""Download portrait cover art for the 40 most-played Steam games.

Requires Pillow once: python3 -m pip install Pillow
"""

from __future__ import annotations

import json
import re
import shutil
import sys
from io import BytesIO
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required. Install it with: python3 -m pip install Pillow")


API_URL = "https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/"
ASSET_URLS = (
    "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/{appid}/library_600x900.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/{appid}/library_600x900.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/{appid}/library_600x900_2x.jpg",
)
OUTPUT_DIRECTORY = Path("steam_top_40_covers")
TARGET_SIZE = (300, 450)
TARGET_COUNT = 40
USER_AGENT = "SteamCoverDownloader/1.0"


def fetch(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=30) as response:
        return response.read()


def safe_filename(name: str, appid: int) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._ -]+", "", name).strip(" .")
    return f"{appid}_{cleaned or 'Steam_Game'}.jpg"


def download_cover(appid: int) -> Image.Image | None:
    for template in ASSET_URLS:
        try:
            with Image.open(BytesIO(fetch(template.format(appid=appid)))) as image:
                return image.convert("RGB").resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        except (HTTPError, URLError, OSError):
            continue
    return None


def main() -> None:
    try:
        games = json.loads(fetch(API_URL))["response"]["ranks"]
    except (HTTPError, URLError, KeyError, json.JSONDecodeError) as error:
        sys.exit(f"Could not retrieve Steam's most-played list: {error}")

    if OUTPUT_DIRECTORY.exists():
        shutil.rmtree(OUTPUT_DIRECTORY)
    OUTPUT_DIRECTORY.mkdir()

    downloaded = []
    for game in games:
        if len(downloaded) == TARGET_COUNT:
            break

        appid = game["appid"]
        name = game["name"]
        cover = download_cover(appid)
        if cover is None:
            print(f"Skipped (no portrait cover found): {name}")
            continue

        filename = safe_filename(name, appid)
        cover.save(OUTPUT_DIRECTORY / filename, "JPEG", quality=95, optimize=True)
        downloaded.append({"appid": appid, "name": name, "file": filename})
        print(f"Downloaded {len(downloaded):02d}/{TARGET_COUNT}: {name}")

    (OUTPUT_DIRECTORY / "manifest.json").write_text(
        json.dumps(downloaded, indent=2), encoding="utf-8"
    )
    print(f"\nSaved {len(downloaded)} cover images to {OUTPUT_DIRECTORY.resolve()}")
    if len(downloaded) < TARGET_COUNT:
        print("Steam did not provide a usable portrait cover for enough games.")


if __name__ == "__main__":
    main()
