FROM python:3.14-slim-bookworm

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    make \
    unzip && \
    rm -rf /var/lib/apt/lists/*

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

WORKDIR /app/

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT [ "./entrypoint.sh" ]

EXPOSE 8000
