### Build Image and Run Container
```shell
docker build -t thebinij/opencvapp:<tag> .  
docker run  -d -p 5000:5000  thebinij/opencvapp:<tag>
```

### Build and Deploy to Docker Hub
```shell
docker buildx build --platform linux/amd64,linux/arm64 -t thebinij/opencvapp:<tag> --push .
```