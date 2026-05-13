#!/usr/bin/env python3
import http.server
import os

PORT = 4174
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    # Always return 200 — skip conditional GET (no 304s in dev)
    def send_head(self):
        self.headers._headers = [(k, v) for k, v in self.headers._headers if k.lower() not in ("if-modified-since", "if-none-match")]
        return super().send_head()

    def log_message(self, fmt, *args):
        pass  # suppress logs

if __name__ == "__main__":
    with http.server.HTTPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Serving {DIRECTORY} on :{PORT} (no-cache)")
        httpd.serve_forever()
