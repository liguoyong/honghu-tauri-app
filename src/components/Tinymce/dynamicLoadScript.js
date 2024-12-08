let callbacks = [];

function loadedTinymce() {
  // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2144
  // check is successfully downloaded script
  return window.tinymce;
}

const dynamicLoadScript = (srcArray, callback) => {
  const cb = callback || function() {};
  let index = 0;

  function loadNextScript() {
    if (index >= srcArray.length) {
      cb(null);
      return;
    }

    const src = srcArray[index];
    const existingScript = document.getElementById(src);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = src; // src url for the third-party library being loaded.
      script.id = src;
      document.body.appendChild(script);

      const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd;
      onEnd(script);
    } else {
      if (loadedTinymce()) {
        index++;
        loadNextScript();
      } else {
        callbacks.push(() => {
          index++;
          loadNextScript();
        });
      }
    }
  }

  function stdOnEnd(script) {
    script.onload = function() {
      this.onerror = this.onload = null;
      index++;
      loadNextScript();
    };
    script.onerror = function() {
      this.onerror = this.onload = null;
      cb(new Error('Failed to load ' + script.src), script);
    };
  }

  function ieOnEnd(script) {
    script.onreadystatechange = function() {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return;
      this.onreadystatechange = null;
      index++;
      loadNextScript();
    };
  }

  loadNextScript();
};

export default dynamicLoadScript;