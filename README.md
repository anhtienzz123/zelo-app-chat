# Zelo App Chat - NodeJs

## Demo: https://www.youtube.com/watch?v=xjQjPvWpoRU&t=73s

## Cách deploy

- Yêu cầu: có cài Docker
- Vào file nginx.conf: dòng 23 sửa lại thành tên miền của mình.
- Vào folder ssl: cung cấp key để chứng thực ssl tên miền.
- Vào file docker-compose.yml: cung cấp env cho mấy cái để trống. 
- Chạy lệnh: docker-compose up -d