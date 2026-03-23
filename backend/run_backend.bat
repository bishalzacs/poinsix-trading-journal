@echo off
echo ===================================================
echo     Poinsix MT5 Local Sync Bridge Starting...
echo ===================================================
echo.
echo Installing dependencies if missing...
python -m pip install -r requirements.txt
echo.
echo Starting FastAPI Server on port 8000...
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
