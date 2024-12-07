// Here is a list of the toolbar
// Detail list see https://www.tinymce.com/docs/advanced/editor-control-identifiers/#toolbarcontrols

// const toolbar = ['searchreplace formatselect fontsizeselect bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen']
const toolbar = [
    {
      name: 'history',
      items: ['undo', 'redo']
    },
    {
      name: 'styles',
      items: ['styleselect', 'formatselect', 'fontsizeselect']
    },
    {
      name: 'formatting',
      items: ['bold', 'italic', 'underline', 'strikethrough']
    },
    {
      name: 'alignment',
      items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify']
    },
    {
      name: 'indentation',
      items: ['outdent', 'indent']
    },
    {
      name: 'lists',
      items: ['bullist', 'numlist']
    },
    {
      name: 'links',
      items: ['link', 'anchor']
    },
    {
      name: 'media',
      items: ['image', 'media', 'pagebreak', 'insertdatetime']
    },
    {
      name: 'tools',
      items: ['removeformat', 'subscript', 'superscript', 'code', 'codesample', 'charmap', 'preview', 'emoticons', 'forecolor', 'backcolor', 'fullscreen']
    },
    {
      name: 'hr',
      items: ['hr']
    }
  ];
  
  export default toolbar;
