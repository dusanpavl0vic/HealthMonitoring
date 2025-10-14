# dockerfile za razvoj vidi lokalne promene
FROM golang:1.25.2-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 8000

CMD ["go", "run", "main.go"]


# FROM golang:1.25.2-alpine AS builder  
# #go image

# WORKDIR /app

# COPY go.mod go.sum ./
# RUN go mod download

# COPY app /app

# # radimo build go aplikacije u izvrsni fajl /analytics-service
# RUN go build -o /app/analytics-service ./app/main.go

# FROM alpine:latest
# WORKDIR /app

# #kopiramo build fajl iz build dela
# COPY --from=builder /app/analytics-service .

# EXPOSE 8000

# #pokrece se servis
# ENTRYPOINT ["./app/analytics-service"]
