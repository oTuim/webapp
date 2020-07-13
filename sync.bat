@CLS
@set SYNCMSG=Update (by Sync)
@TITLE SYNC - Running...

@ECHO.
@ECHO.
@ECHO ---------------------------------------------
@ECHO.
@ECHO   SYNC - git command accelerator
@ECHO   [-p]   Roda sem perguntas...
@ECHO.
@ECHO ---------------------------------------------

@IF "%~1"=="-p" (GOTO SEMPAUSA) ELSE GOTO PAUSADO

:PAUSADO
@ECHO.
@git status 
@ECHO.
@CHOICE /C SNX /T 20 /D S /N /M ">>    Deseja rodar git add? [S/N/X]"
@SET OPT=%ERRORLEVEL%
@IF %OPT% EQU 2 GOTO COMMIT 
@IF %OPT% EQU 3 GOTO FINAL
@ECHO.
@TITLE SYNC - Running ADD
@git add *

:COMMIT
@ECHO.
@CHOICE /C SNX /T 20 /D S /N /M ">>    Deseja rodar git commit? [S/N/X]"
@SET OPT=%ERRORLEVEL%
@IF %OPT% EQU 2 GOTO PULL 
@IF %OPT% EQU 3 GOTO FINAL
@ECHO.
@TITLE SYNC - Running COMMIT
@set /p SYNCMSG=Digite uma descrição para o COMMIT: 
@git commit -a -m "%SYNCMSG%"

:PULL
@ECHO.
@CHOICE /C SNX /T 20 /D S /N /M ">>    Deseja rodar git pull? [S/N/X]"
@SET OPT=%ERRORLEVEL%
@IF %OPT% EQU 2 GOTO PUSH 
@IF %OPT% EQU 3 GOTO FINAL
@ECHO.
@TITLE SYNC - Running PULL
@git pull

:PUSH
@ECHO.
@CHOICE /C SNX /T 20 /D S /N /M ">>    Deseja rodar git push? [S/N/X]"
@SET OPT=%ERRORLEVEL%
@IF %OPT% EQU 2 GOTO FINAL 
@IF %OPT% EQU 3 GOTO FINAL
@ECHO.
@TITLE SYNC - Running PUSH
@git push

@GOTO FINAL

:SEMPAUSA
@ECHO.
@git status 
@ECHO.
@TITLE SYNC - Running ADD
@git add *
@ECHO.
@ECHO.
@TITLE SYNC - Running COMMIT
@git commit -a -m "%SYNCMSG%"
@ECHO.
@ECHO.
@TITLE SYNC - Running PULL
@git pull
@ECHO.
@ECHO.
@TITLE SYNC - Running PUSH
@git push

:FINAL
@TITLE SYNC - is finished!
@ECHO. 