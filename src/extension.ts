// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('no-flows-given.helloWorld', () => {
        // Create and show panel
        const panel = vscode.window.createWebviewPanel(
            'youtubePlayer',
            'YouTube Player',
            vscode.ViewColumn.Two,
            {
                enableScripts: true
            }
        );

        // Set HTML content
        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>YouTube Player</title>
            <style>
                body {
                    padding: 0;
                    margin: 0;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    padding: 10px;
                }
                #player {
                    width: 100%;
                    height: 200px;
                }
                #videoInput {
                    margin-bottom: 10px;
                    padding: 5px;
                }
                #loadButton {
                    padding: 5px;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <input type="text" id="videoInput" placeholder="Enter YouTube video ID">
                <button id="loadButton">Load Video</button>
                <div id="player"></div>
            </div>
            <script>
                // Load YouTube IFrame API
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                let player;
                function onYouTubeIframeAPIReady() {
                    player = new YT.Player('player', {
                        height: '200',
                        width: '100%',
                        videoId: 'L_fcrOyoWZ8', // Default video
                        playerVars: {
                            'playsinline': 1,
                            'controls': 1
                        }
                    });
                }

                // Add event listeners
                document.getElementById('loadButton').addEventListener('click', () => {
                    const videoId = document.getElementById('videoInput').value;
                    if (videoId) {
                        player.loadVideoById(videoId);
                    }
                });
            </script>
        </body>
        </html>
    `;
}

// This method is called when your extension is deactivated
export function deactivate() {}
