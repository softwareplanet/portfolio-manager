FROM python:3.7

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /repo

# Install dependencies
RUN pip install pipenv
RUN pip install mysqlclient
COPY Pipfile Pipfile.lock /repo/
RUN pipenv install --system


# Copy project
COPY . /repo/