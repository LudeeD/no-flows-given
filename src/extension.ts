import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "no-flows-given.helloWorld",
        () => {
            const panel = vscode.window.createWebviewPanel(
                "localVideoPlayer",
                "Local Video Player",
                vscode.ViewColumn.Two,
                {
                    localResourceRoots: [
                        vscode.Uri.file(path.join(context.extensionPath, "media")),
                    ],
                    enableScripts: true, // Enable scripts for autoplay handling
                }
            );

            const videoFilePath = path.join(
                context.extensionPath,
                "media",
                "subwaysurfers.mp4"
            );
            
            const videoFileUri = panel.webview.asWebviewUri(
                vscode.Uri.file(videoFilePath)
            );

            panel.webview.html = getWebviewContent(
                videoFileUri,
                panel.webview.cspSource
            );
        }
    );
    context.subscriptions.push(disposable);
}

function getWebviewContent(videoUri: vscode.Uri, cspSource: string): string {
    return /* html */ `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta
                http-equiv="Content-Security-Policy"
                content="
                    default-src 'none';
                    style-src 'unsafe-inline';
                    media-src ${cspSource};
                    script-src 'unsafe-inline';
                "
            >
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                }
                video {
                    max-width: 100%;
                    border: 1px solid #666;
                }
            </style>
        </head>
        <body>
            <video 
                id="videoPlayer"
                controls 
                autoplay 
                muted 
                loop
                src="${videoUri}"
            ></video>
            <script>
                // Ensure autoplay works
                window.onload = function() {
                    const video = document.getElementById('videoPlayer');
                    
                    // Try to play the video
                    const playPromise = video.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Autoplay failed:", error);
                            // If autoplay fails, you might want to show a play button
                            // or handle it in some other way
                        });
                    }

                    // Optional: Unmute when user interacts with the page
                    document.addEventListener('click', function() {
                        video.muted = false;
                    }, { once: true });
                }
            </script>
        </body>
        </html>
    `;
}

export function deactivate() {}