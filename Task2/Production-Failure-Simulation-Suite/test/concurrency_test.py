import threading
import requests
import time

success = 0
failure = 0

def hit_api():
    global success, failure

    try:
        response = requests.get(
            "http://127.0.0.1:8000/disconnect"
        )

        if response.status_code == 200:
            success += 1
        else:
            failure += 1

    except:
        failure += 1


start_time = time.time()

threads = []

for _ in range(100):   # 100 users

    t = threading.Thread(
        target=hit_api
    )

    threads.append(t)
    t.start()

for t in threads:
    t.join()

end_time = time.time()

print(f"Success: {success}")
print(f"Failure: {failure}")
print(
    f"Total Time: {end_time - start_time:.2f} sec"
)