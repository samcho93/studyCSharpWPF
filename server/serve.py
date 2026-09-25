"""C# · WPF 웹 실습 강좌 — 로컬 · 교실용 웹 서버 (파이썬 3.8+ 표준 라이브러리만 사용)

    python server/serve.py            # http://localhost:8080
    python server/serve.py --lan      # 같은 네트워크의 학생 PC 에서 접속 (교사 PC 주소 표시)
    python server/serve.py --port 9000

- 강좌 파일(HTML · JS · C# 실행 환경 runtime/cs)을 제공할 뿐이다.
  C# 코드는 서버가 아니라 각 학생의 브라우저에서 컴파일 · 실행된다.
- 교차 출처 격리(COOP/COEP) 헤더를 붙여 실행 중 Console.ReadLine 입력(SharedArrayBuffer)이 되게 한다.
  (LAN 에서 http://192.168.x.x 로 접속하면 브라우저 보안 정책상 실행 전에 입력을 미리 받는다)
"""
import argparse
import os
import socket
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    extensions_map = dict(SimpleHTTPRequestHandler.extensions_map, **{
        '.wasm': 'application/wasm', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
        '.gz': 'application/gzip', '.dll': 'application/octet-stream', '.dat': 'application/octet-stream', '.json': 'application/json'})

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        sys.stderr.write('%s  %s\n' % (time.strftime('%H:%M:%S'), fmt % args))

    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Resource-Policy', 'same-origin')
        # 실행 환경(약 30MB)는 오래 캐시, 나머지는 매번 확인
        self.send_header('Cache-Control', 'max-age=604800' if '/runtime/' in self.path else 'no-cache')
        super().end_headers()


def lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        return s.getsockname()[0]
    except OSError:
        return '127.0.0.1'
    finally:
        s.close()


def main():
    ap = argparse.ArgumentParser(description='C# · WPF 웹 실습 강좌 서버')
    ap.add_argument('--port', type=int, default=8080)
    ap.add_argument('--lan', action='store_true', help='같은 네트워크의 다른 PC 에서도 접속 허용')
    a = ap.parse_args()
    host = '0.0.0.0' if a.lan else '127.0.0.1'
    httpd = ThreadingHTTPServer((host, a.port), Handler)
    print('=' * 60)
    print(' C# · WPF 프로그래밍 웹 실습 강좌')
    print('   학생용: http://localhost:%d/student.html' % a.port)
    print('   교사용: http://localhost:%d/teacher.html' % a.port)
    if a.lan:
        print('   학생 PC 접속 주소: http://%s:%d' % (lan_ip(), a.port))
    print('  (종료: Ctrl+C)')
    print('=' * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
