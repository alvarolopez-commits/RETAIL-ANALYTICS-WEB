"""Tiny static server for local review (no caching, so edits show up on refresh).
Usage:  python serve.py [port]      → http://localhost:5173
"""
import http.server, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, *a):  # quiet
        pass

http.server.ThreadingHTTPServer(("", PORT), Handler).serve_forever()
