<template>
  <div>file</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
:deep(.el-dialog__body) {
  padding-top: 0;
  padding-bottom: 10px !important;
}

:deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>

<style scoped lang="scss">
$file-height: 100px;
$row-gap: 30px;
$column-gap: 16px;

#file-menu {
  display: none;
  position: absolute;
}


.dropdown-icon {
  padding: 4px 10px;
  text-align: center;
  color: #337ecc;

  &:focus-visible {
    outline: unset;
  }
}

.my-files {
  padding: 0 5px;
  position: relative;
  height: 90%;

  .filemenu {
    position: absolute;
    border: 1px solid var(--el-menu-border-color);
    color: var(--text-color);
    background-color: var(--bg-color);
    border-radius: 5px;
    cursor: default;

    .item {
      list-style: none;
      padding: 4px 6px;
      min-width: 76px;
    }

    .item:hover {
      background-color: var(--file-menu-hover);
    }
  }
}


.tools-box {
  display: flex;
  position: fixed;
  z-index: 999;
  top: 56px;
  left: 162px;
  right: 8px;
  background-color: var(--bg-color);

  .path-tool {
    height: 38px;
    line-height: 38px;
    width: 30%;
    flex: 1;
    display: flex;
    align-items: center;

    .path-btn {
      padding: 0;
      width: 20px;
      height: 20px;
      text-align: center;
      border-radius: 10px;
    }

    .path-icon {
      font-size: 19px;

      :hover {
        color: #337ecc;
      }
    }

    .path {
      max-width: 95%;
      display: inline-block;
      border-radius: 16px;
      background-color: var(--bg-color);
      padding: 0 6px;
      font-size: 14px;
      margin-left: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
  }

  .action {
    width: 572.5px;
    display: flex;
    justify-content: end;
    align-items: center;

    .show {
      font-size: 22px;
      cursor: pointer;
    }
  }
}

.file-name {
  text-align: center;
  width: 90px;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-name {
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.table-action {
  .el-button {
    height: 20px;
  }
}

.file-box {
  height: auto;
  margin-top: 36px;
  padding-bottom: 58px;
}

.file-tips {
  width: 180px;
}

.grid-style {
  display: flex;
  flex-wrap: wrap;

  .upload-file {
    width: 120px;
    height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .upload-inner {
      width: 60px;
      height: 60px;
    }

    .upload-name {
      margin-top: 18px;
      user-select: none;
    }

    :deep(.el-upload-dragger) {
      width: 60px;
      height: 60px;
      line-height: 60px;
      padding: unset;
    }
  }

  .file-item {
    width: 110px;
    padding: 10px 15px;
    margin: 5px;
    border-radius: 5px;
    position: relative;

    .file-select {
      position: absolute;
      top: 3px;
      left: 5px;
      display: none;
    }

    .hiden-check {
      display: none !important;
    }

    .more-action {
      position: absolute;
      top: 3px;
      right: 5px;
      display: block;
    }

    .check-show {
      display: block;
    }
  }

  .file-loading {
    :deep(.el-loading-mask) {
      background-color: var(--file-loading-mask);
    }

    :deep(.el-loading-mask:hover) {
      background-color: var(--file-loading-hover) !important;
    }
  }

  .file-loading:hover {
    :deep(.el-loading-mask) {
      background-color: var(--file-loading-hover) !important;
    }
  }

  .item-seled {
    background-color: var(--selected-item) !important;
  }

  .file-item:hover {
    cursor: default;
    background-color: var(--filt-item);

    .file-select,
    .more-action {
      display: block;
    }
  }
}

.file-type {
  width: 80px;
  margin: 0 10px;
}

.search-input {
  width: 200px;
  margin-right: 5px;
}
</style>
