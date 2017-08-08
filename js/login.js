$(function () {
  const input_bg_color = $('#username').css('border-color');
  // const api_url = 'http://59.110.233.230';
  const api_url = '';
  const api_path = "/com.iecloud/";
  const apiInterface = {
    login: api_url + api_path + 'user/login.do'
  };

  $('#submit').on('click', function () {
    let username = $('#username').val();
    let password = $('#password').val();
    if (null == username || '' == username) {
      $('#username').css('border-color', 'red');
      return;
    } else if (null == password || '' == password) {
      $('#username').css('border-color', input_bg_color);
      $('#password').css('border-color', 'red');
      return;
    }
    $('#password').css('border-color', input_bg_color);
    let params = {
      phoneNumber: username,
      password: password
    };
    login(params);

  });

  function login(params) {
    $.ajax({
      url: apiInterface.login,
      type: 'POST',
      data: params
    })
      .done(function (data) {
        if (data.status == 0) {
          sessionStorage.setItem('name', data.data.phone);
          location.href = "index.html";
        } else {
          swal('登录失败', '', 'error');
        }
      })
      .fail(function () {
        swal('执行异常', '', 'error');
      });
  }
});
