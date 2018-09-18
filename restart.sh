#!/usr/bin/env bash
fuser -k 8000/tcp
source activate pman
python manage.py runserver 0.0.0.0:8000 &
disown %1