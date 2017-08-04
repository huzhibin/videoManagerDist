$(function () {
  const input_bg_color = $('#username').css('border-color');

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
      url: '/com.iecloud/user/login.do',
      type: 'POST',
      data: params
    })
      .done(function (data) {
        if (data.status == 0) {
          sessionStorage.setItem('name', data.data.phone);
          location.href = "index.html";
        } else {
          alert('登录失败');
        }
      })
      .fail(function () {
        alert('执行异常');
      });

  }


});
