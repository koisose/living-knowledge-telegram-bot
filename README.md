# How to run

if you want to run this you need docker maybe you can also run with vercel but i have never tried that first fill in the env:

```
ENV LIVINGKNOWLEDGE_BOT=
ENV BRAVESEARCH_API=
```

The most important thing is this two but if there is any error just contact me at telegram, then build it using this command:

```
docker build -t living
```

Then run it with:

```
docker run -d -p 3000:3000 living
```

You can open it in <your ip>:3000 you need also a domain to set up webhook to set up webhook run this:

```
curl -F "url=https://<yourdomain.com>/webhook" "https://api.telegram.org/bot<bot token>/setWebhook"
```

Video demo: https://www.youtube.com/watch?v=dXQk3fhCTLs