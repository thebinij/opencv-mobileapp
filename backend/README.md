### Build Image and Run Container
```shell
docker build -t thebinij/opencvapp:<tag> .  
docker run  -d -p 5000:5000  thebinij/opencvapp:<tag>
```

### Build and Deploy to Docker Hub
```shell
docker buildx build --platform linux/amd64,linux/arm64 -t thebinij/opencvapp:<tag> --push .
```


### Local Build using conda env
```shell
conda create -n myenv3.11 python=3.11.4
conda activate myenv3.11
pip install -r requirements.txt
```