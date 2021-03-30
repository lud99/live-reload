# live-reload
A simple Nodejs cli to watch directories and reload your web browser when they change.

### Usage
```npm install -g @ultralud/live-reload```

Run ```live-reload``` with the arguments being the absolute paths to the directories to watch. You can specify as many as you want.  
In your HTML files, add the script tag ```<script src="http://localhost:9731/client-script.js"></script>``` somewhere. 

Voila! Your web browser will now automatically reload when something changes

Please note that files withing directories starting with ```.``` will be ignored. The same goes for files starting with a ```.```
