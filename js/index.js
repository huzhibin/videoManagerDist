$(function () {
  // const api_url = 'http://59.110.233.230';
  const api_url = '';
  const api_path = "/com.iecloud/manage/video/";
  const apiInterface = {
    uploadVideoRecord: api_url + api_path + 'uploadVideoRecord.do',
    getVideoList: api_url + api_path + 'getVideoList.do',
    updateVideo: api_url + api_path + 'updateVideo.do',
    deleteVideo: api_url + api_path + 'deleteVideo.do'
  };
  const initModalData = {
    title: '',
    detail: '',
    smoothFile: null,
    SDFile: null,
    HDFile: null
  };
  const pageSize = 10;

  let totalPage = 1,
    pageNumber = 1;

  init();

  //页面初始化
  function init() {
    getVideoList({
      pageNumber,
      pageSize
    });

    //初始化分页
    $('#pagination').jqPaginator({
      totalPages: totalPage,
      visiblePages: pageSize,
      currentPage: 1,
      onPageChange: function (num, type) {
        pageNumber = num;
        getVideoList({
          pageNumber,
          pageSize
        })
      }
    });

    //监听编辑、删除按钮和播放按钮
    $('#videoTable').on('click', function (e) {
      if ($(e.target).data('name') == 'edit') {
        modalInit({
          title: $(e.target).data('title'),
          detail: $(e.target).data('detail'),
          smoothFile: null,
          SDFile: null,
          HDFile: null
        }, '视频编辑', 'edit', $(e.target).data('id'));
      } else if ($(e.target).data('name') == 'delete') {
        swal({
          title: "确认删除该视频？",
          text: $(e.target).data('title'),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnConfirm: false
        },
          function () {
            deleteVideo({
              id: parseInt($(e.target).data('id'))
            });
          });
      } else if ($(e.target).data('name') == 'play') {
        showVideoPlayModal($(e.target).data('title'), $(e.target).data("source"));
      }
    });
    $('#uploadBtn').on('click', function (e) {
      modalInit(initModalData, '视频上传', 'upload');
    });

    //提交模态框
    $('#videoSubmit').on('click', function (e) {
      let title = $('#videoTitle').val(),
        detail = $('#videoDetail').val(),
        // typeid = $('#videoType').val(),
        smoothFile = $("#smoothFile")[0].files[0],
        SDFile = $("#SDFile")[0].files[0],
        HDFile = $("#HDFile")[0].files[0];

      if (null == title || '' == title) {
        showModalTips('标题不能为空');
        return;
      } else if (null == detail || '' == detail) {
        showModalTips('描述不能为空');
        return;
      }

      if ($('#videoSubmit').data('name') == 'upload') {
        if ((null == smoothFile || '' == smoothFile || undefined == smoothFile)) {
          showModalTips('上传流畅视频文件不能为空');
          return;
        } else if (smoothFile.name.split('.').reverse()[0] != "mp4") {
          showModalTips('视频文件必须为mp4格式');
          return;
        } else if ((null == SDFile || '' == SDFile || undefined == SDFile)) {
          showModalTips('上传标清视频文件不能为空');
          return;
        } else if (SDFile.name.split('.').reverse()[0] != "mp4") {
          showModalTips('视频文件必须为mp4格式');
          return;
        } else if ((null == HDFile || '' == HDFile || undefined == HDFile)) {
          showModalTips('上传高清视频文件不能为空');
          return;
        } else if (HDFile.name.split('.').reverse()[0] != "mp4") {
          showModalTips('视频文件必须为mp4格式');
          return;
        }
      } else if ($('#videoSubmit').data('name') == 'edit') {
        if ((null != smoothFile && '' != smoothFile && undefined != smoothFile)) {
          if (smoothFile.name.split('.').reverse()[0] != "mp4") {
            showModalTips('视频文件必须为mp4格式');
            return;
          }
        }
        if ((null != SDFile && '' != SDFile && undefined != SDFile)) {
          if (SDFile.name.split('.').reverse()[0] != "mp4") {
            showModalTips('视频文件必须为mp4格式');
            return;
          }
        }
        if ((null != HDFile && '' != HDFile && undefined != HDFile)) {
          if (HDFile.name.split('.').reverse()[0] != "mp4") {
            showModalTips('视频文件必须为mp4格式');
            return;
          }
        }
      }

      hideModalTips();
      let formData = new FormData($('#video-form')[0]);

      //选择文件时才显示进度条
      if ((null != smoothFile && '' != smoothFile && undefined != smoothFile) ||
        (null != SDFile && '' != SDFile && undefined != SDFile) ||
        (null != HDFile && '' != HDFile && undefined != HDFile)
      ) {
        showProgress();
      }
      if ($('#videoSubmit').data('name') == 'upload') {
        uploadVideoRecord(formData);
      } else if ($('#videoSubmit').data('name') == 'edit') {
        formData.append("id", parseInt($('#videoSubmit').data('id')));
        updateVideo(formData);
      }
    })
  }

  //模态框表单提示
  function showModalTips(tips) {
    $('#modalTips').html(tips);
    $('#modalTips').show();
  }
  function hideModalTips() {
    $('#modalTips').hide();
  }

  //初始化设置模态框
  function modalInit(modalData, title, name, id) {
    $('#modalTitle').text(title);
    $('#videoSubmit').data('name', name);
    $('#videoSubmit').data('id', id || '');

    $('#videoTitle').val(modalData.title || '');
    $('#videoDetail').val(modalData.detail || '');
    $('#smoothFile').val(modalData.smoothFile || null);
    $('#SDFile').val(modalData.SDFile || null);
    $('#HDFile').val(modalData.HDFile || null);

    if (name == 'edit') {
      $('span.fileTips').hide();
    } else if (name == 'upload') {
      $('span.fileTips').show();
    }
    hideModalTips();
    hideProgress();
  }

  //显示视频播放模态框
  function showVideoPlayModal(title, source) {
    $('#videoPlayModal h4.modal-title').text(title);
    $('#videoPlayModal video').attr('src', source);

    $('#showVideoPlayModal').trigger('click');//显示模态框
  }

  //设置上传文件进度条
  function setProgress(progress) {
    $('#progress span').text(progress);
    $('#progress>div').css('width', progress);
  }
  //显示进度条
  function showProgress() {
    $('#progress>div').css('width', 0);
    $('#progress').show();
  }
  //隐藏进度条
  function hideProgress() {
    $('#progress').hide();
  }



  //上传视频
  function uploadVideoRecord(params) {
    $.ajax({
      url: apiInterface.uploadVideoRecord,
      type: 'post',
      // 不要去处理发送的数据
      processData: false,
      // 不要去设置Content-Type请求头
      contentType: false,
      data: params,
      xhr: function () {
        showProgress();
        let xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function (e) {
          setProgress(Math.floor(e.loaded / e.total * 100) + '%');
        };
        return xhr;
      },
    })
      .done(function (data) {
        if (data.status == 0) {
          swal('上传成功', '', 'success');
          $('#modalClose').trigger('click');
          getVideoList({
            pageNumber,
            pageSize
          });
        } else {
          swal('上传失败', '', 'error');
        }
      })
      .fail(function () {
        swal('执行异常', '', 'error');
      })
      .always(function () {
        // hideProgress();
      })
  }

  //删除视频
  function deleteVideo(params) {
    $.ajax({
      url: apiInterface.deleteVideo,
      type: 'get',
      data: params
    })
      .done(function (data) {
        if (data.status == 0) {
          swal('删除成功', '', 'success');
          getVideoList({
            pageNumber,
            pageSize
          });
        } else {
          swal('删除失败', '', 'error');
        }
      })
      .fail(function () {
        swal('执行异常', '', 'error');
      })
  }

  // 获取视频列表
  function getVideoList(params) {
    $.ajax({
      url: apiInterface.getVideoList,
      type: 'post',
      dataType: '',
      data: params,

    })
      .done(function (data) {
        if (data.status == 0) {
          let html = "";
          //列表展示内容
          for (let i = 0; i < data.data.list.length; i++) {
            let date = new Date(data.data.list[i].createTime);
            html += `
          <tr data-id="${data.data.list[i].id}" data-type="${data.data.list[i].typeid}">
            <td>
              ${data.data.list[i].title}
            </td>
            <td>
              <a href="javascript:void(0);"><img alt="error" data-name="play" data-title="${data.data.list[i].title}" data-source="${data.data.list[i].videoAddress}" src="${data.data.list[i].videoImageAddress}" class="img-thumbnail" /></a>
            </td>
            <td>
              ${data.data.list[i].detail}
            </td>
            <td>
              ${formatDate(date)}
            </td>
            <td>
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalVideo" data-name="edit" data-id="${data.data.list[i].id}"
              data-title="${data.data.list[i].title}" data-detail="${data.data.list[i].detail}" data-type="${data.data.list[i].typeid}">编辑</button>

              <button type="button" class="btn btn-danger" data-name="delete" data-id="${data.data.list[i].id}"
              data-title="${data.data.list[i].title}">删除</button>
            </td>
          </tr>`;
          }
          $('table tbody').html(html);

          totalPage = data.data.pages; //总页数
          $('#pagination').jqPaginator('option', {
            totalPages: totalPage,
            currentPage: pageNumber
          });
          $('nav[name="pagination"]>span').html('当前第' + pageNumber + '页,共' + totalPage + '页');
        } else {
          swal(data.msg, '', 'error')
        }

      })
      .fail(function () {
        swal('执行异常', '', 'error');
      })
      .always(function () {
        // alert("complete");
      });
  }

  // 编辑视频
  function updateVideo(params) {
    $.ajax({
      url: apiInterface.updateVideo,
      type: 'post',
      // 不要去处理发送的数据
      processData: false,
      // 不要去设置Content-Type请求头
      contentType: false,
      data: params,
      xhr: function () {
        let xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function (e) {
          setProgress(Math.floor(e.loaded / e.total * 100) + '%');
        };
        return xhr;
      },
    })
      .done(function (data) {
        if (data.status == 0) {
          swal('编辑成功', '', 'success');
          $('#modalClose').trigger('click');
          getVideoList({
            pageNumber,
            pageSize
          });
        } else {
          swal('编辑失败', '', 'error');
        }
      })
      .fail(function () {
        swal('执行异常', '', 'error');
      })
      .always(function () {
        // hideProgress();
      })
  }

  function formatDate(date) {
    return date.getFullYear()
      + "-" + (date.getMonth() > 8 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1))
      + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
      + " " + (date.getHours() > 9 ? date.getHours() : "0" + date.getHours())
      + ":" + (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes())
      + ":" + (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds());
  }
});
