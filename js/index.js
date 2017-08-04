$(function () {

  const api_url = '',
    api_path = "/manage/video/";

  let tagFilter = [],
    totalPage = 0,
    pageNumber = 1;

  const initModalData = {
    title: '',
    detail: '',
    // typeid: null,
    smoothFile: null,
    SDFile: null,
    HDFile: null
  },
    pageSize = 10;

  getVideoList({
    pageNumber,
    pageSize
  });
  hideModalTips();
  hideProgress();
  $('#modal-video').modal('hide');
  // getAllTpye();

  //模态框表单提示
  function showModalTips(tips) {
    $('#modalTips').html(tips);
    $('#modalTips').show();
  }

  function hideModalTips() {
    $('#modalTips').hide();
  }
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
      // } else if (null == typeid || '' == typeid) {
      //   showModalTips('标签不能为空');
      //   return;
    } else if ($('#videoSubmit').data('name') == 'upload' && (null == smoothFile || '' == smoothFile)) {
      showModalTips('上传流畅视频文件不能为空');
      return;
    } else if ($('#videoSubmit').data('name') == 'upload' && (null == SDFile || '' == SDFile)) {
      showModalTips('上传标清视频文件不能为空');
      return;
    } else if ($('#videoSubmit').data('name') == 'upload' && (null == HDFile || '' == HDFile)) {
      showModalTips('上传高清视频文件不能为空');
      return;
    }
    hideModalTips();
    let formData = new FormData($('#video-form')[0]);
    // formData.append("typeid", typeid);
    // formData.append("detail", detail);
    // formData.append("title", title);

    if ($('#videoSubmit').data('name') == 'upload') {
      showProgress();
      uploadVideoRecord(formData);
    } else if ($('#videoSubmit').data('name') == 'edit') {
      formData.append("id", parseInt($('#videoSubmit').data('id')));
      showProgress();
      updateVideo(formData);
    }
  })

  //设置模态框
  function modalInit(modalData, title, name, id) {
    $('#modalTitle').text(title);
    $('#videoSubmit').data('name', name);
    $('#videoSubmit').data('id', id || '');

    $('#videoTitle').val(modalData.title || '');
    $('#videoDetail').val(modalData.detail || '');
    // $('#videoType').val(modalData.typeid || '');
    $('#smoothFile').val(modalData.smoothFile || null);
    $('#SDFile').val(modalData.SDFile || null);
    $('#HDFile').val(modalData.HDFile || null);

    if (name == 'edit') {
      $('span.fileTips').hide();
    } else if (name == 'upload') {
      $('span.fileTips').show();
    }
    hideProgress();
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

  //监听分页
  $('#pagination').on('click', 'a', function (e) {
    if (parseInt($(e.target).data('id')) == pageNumber) {
      return;
    }
    if ($(e.target).data('id') == 'prev') {
      if (pageNumber <= 1) {
        return;
      }
      pageNumber--;
    } else if ($(e.target).data('id') == 'next') {
      if (pageNumber >= totalPage) {
        return;
      }
      pageNumber++;
    } else {
      pageNumber = parseInt($(e.target).data('id'));
    }
    $('#pagination span').html(`第${pageNumber}页`);
    getVideoList({
      pageNumber,
      pageSize
    });
  });

  //监听编辑和删除按钮
  $('#videoTable').on('click', function (e) {
    if ($(e.target).data('name') == 'edit') {
      modalInit({
        title: $(e.target).data('title'),
        detail: $(e.target).data('detail'),
        // typeid: $(e.target).data('type'),
        smoothFile: null,
        SDFile: null,
        HDFile: null
      }, '视频编辑', 'edit', $(e.target).data('id'));

      $('#modal-video').modal('show');
    } else if ($(e.target).data('name') == 'delete') {
      if (confirm(`
        确认删除该视频？\n
        ${$(e.target).data('title')}
      `)) {
        deleteVideo({
          id: parseInt($(e.target).data('id'))
        });
      }
    }
  });
  $('#uploadBtn').on('click', function (e) {
    modalInit(initModalData, '视频上传', 'upload');
    $('#modal-video').modal('show');

  });

  //监听标签选择按钮
  // $('#tag').on('click', 'span.tag', function(e) {
  //   let $tag = $(e.target);
  //   if ('' == $tag.data('id') || null == $tag.data('id')) {
  //     return;
  //   } else {
  //     filterTag($tag.data('id'));
  //   }
  //
  //   $tag.toggleClass('label-success');
  // });
  //过滤标签
  // function filterTag(typeid) {
  //   $('table tbody tr').each(function() {
  //     if (($(this).data('type') + '').split(' ').indexOf(typeid + '') == -1) {
  //       $(this).hide();
  //     }
  //   })
  // }



  //设置分页
  function setPagination(totalPage) {
    let html = "";
    while (totalPage > 0) {
      html = `
      <li>
        <a href="javascript:void(0);" data-id="${totalPage}">${totalPage}</a>
      </li>
    ` + html;
      totalPage--;
    };
    html = `
    <span>第${pageNumber}页</span>
    <ul class="pagination">
      <li>
        <a href="javascript:void(0);" data-id="prev">Prev</a>
      </li>
    ` + html + `
      <li>
        <a href="javascript:void(0);" data-id="next">Next</a>
      </li>
    </ul>
    `;
    $('#pagination').html(html);
  }

  //上传视频
  function uploadVideoRecord(params) {
    $.ajax({
      url: api_url + api_path + 'uploadVideoRecord.do',
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
          alert('上传成功');
          $('#modal-video').modal('hide');
          getVideoList({
            pageNumber,
            pageSize
          });
        } else {
          alert('上传失败');
        }
      })
      .fail(function () {
        alert('执行异常');
      })
      .always(function () {
        // hideProgress();
      })
  }

  //删除视频
  function deleteVideo(params) {
    $.ajax({
      url: api_url + api_path + 'deleteVideo.do',
      type: 'get',
      data: params
    })
      .done(function (data) {
        if (data.status == 0) {
          alert('删除成功');
          getVideoList({
            pageNumber,
            pageSize
          });
        } else {
          alert('删除失败');
        }
      })
      .fail(function () {
        alert('执行异常');
      })
  }

  // 获取视频列表
  function getVideoList(params) {
    $.ajax({
      url: api_url + api_path + 'getVideoList.do',
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
              <a href="${data.data.list[i].videoAddress}" target="blank"><img alt="error" src="${data.data.list[i].videoImageAddress}" class="img-thumbnail" /></a>
            </td>
            <td>
              ${data.data.list[i].detail}
            </td>
            <td>
              ${`${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}
            </td>
            <td>
              <button type="button" class="btn btn-default active btn-warning" href="#modal-video" data-name="edit" data-id="${data.data.list[i].id}"
              data-title="${data.data.list[i].title}" data-detail="${data.data.list[i].detail}" data-type="${data.data.list[i].typeid}">编辑</button>

              <button type="button" class="btn btn-default active btn-danger" data-name="delete" data-id="${data.data.list[i].id}"
              data-title="${data.data.list[i].title}">删除</button>
            </td>
          </tr>`;
          }
          $('table tbody').html(html);

          totalPage = data.data.pages; //总页数
          setPagination(totalPage); //设置分页

        } else {
          alert(data.msg);
        }

      })
      .fail(function () {
        alert("执行异常");
      })
      .always(function () {
        // alert("complete");
      });
  }

  //获取视频分类
  // function getAllTpye() {
  //   $.ajax({
  //       url: api_url + api_path + 'getAllTpye.do',
  //       type: 'post',
  //       dataType: '',
  //       data: {}
  //     })
  //     .done(function(data) {
  //       if (data.status == 0) {
  //         let html = "";
  //         for (let i = 0; i < data.data.length; i++) {
  //           html += `
  //             <span class="label label-default tag" data-id="${data.data[i].id}">${data.data[i].name}</span>
  //           `;
  //         }
  //         $('#tag').html(html);
  //
  //       } else {
  //         console.log(data.msg)
  //       }
  //       console.log("success");
  //     })
  //     .fail(function() {
  //       alert('执行异常');
  //     })
  // }

  // 编辑视频
  function updateVideo(params) {
    $.ajax({
      url: api_url + api_path + 'updateVideo.do',
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
          alert('编辑成功');
          $('#modal-video').modal('hide');
          getVideoList({
            pageNumber,
            pageSize
          });
        } else {
          alert('编辑失败');
        }
      })
      .fail(function () {
        alert('执行异常');
      })
      .always(function () {
        // hideProgress();
      })
  }
});
