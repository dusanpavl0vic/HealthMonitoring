# dockerfile za razvoj vidi lokalne promene
FROM golang:1.21-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY app /app

EXPOSE 8000

CMD ["go", "run", "main.go"]


# FROM golang:1.21-alpine AS builder  
# #go image

# WORKDIR /app

# COPY go.mod go.sum ./
# RUN go mod download

# COPY . .

# # radimo build go aplikacije u izvrsni fajl /analytics-service
# RUN go build -o /analytics-service ./main.go

# FROM alpine:latest
# WORKDIR /app

# #kopiramo build fajl iz build dela
# COPY --from=builder /analytics-service .

# EXPOSE 8000

# #pokrece se servis
# ENTRYPOINT ["./analytics-service"]
