OBR.onReady(() => {
  console.log("No Resize Tokens (Persistent) extension loaded!");

  // When a token is created, store its initial dimensions if GM
  OBR.scene.onTokenCreate((token, user) => {
    if (user.isGM) {
      OBR.scene.updateToken(token.id, {
        metadata: {
          ...token.metadata,
          lockedWidth: token.width,
          lockedHeight: token.height
        }
      });
    }
  });

  // Watch for token updates
  OBR.scene.onTokenUpdate((token, change, user) => {
    if (!user.isGM && (change.width || change.height)) {
      // Reset to locked dimensions
      OBR.scene.updateToken(token.id, {
        width: token.metadata.lockedWidth || token.width,
        height: token.metadata.lockedHeight || token.height
      });
    }
    // If GM changes size, update the locked dimensions
    if (user.isGM && (change.width || change.height)) {
      OBR.scene.updateToken(token.id, {
        metadata: {
          ...token.metadata,
          lockedWidth: token.width,
          lockedHeight: token.height
        }
      });
    }
  });

  // Optional: hide resize handles for non-GMs
  OBR.viewport.onRender(() => {
    if (!OBR.player.currentUser.isGM) {
      document.querySelectorAll('.token-resize-handle').forEach(handle => {
        handle.style.display = 'none';
      });
    }
  });
});
