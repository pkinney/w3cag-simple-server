$(function() {
  console.log('Establishing connection...');
  const socket = new WebSocket('ws://192.168.99.100:3000');

  socket.onopen = function() {
    console.log('Connection established');
  };

  socket.onmessage = function(message) {
    $('ul.feed-list').prepend('<li>RECEIVED: <code>' + message.data + '</code></li>');
    const payload = JSON.parse(message.data);

    $(".vehicle-value[data-value='" + payload.path + "'] .value").text(JSON.stringify(payload.value));
    $(".vehicle-value[data-value='" + payload.path + "'] .value").addClass('highlight');
    setTimeout(function() {
      $(".vehicle-value[data-value='" + payload.path + "'] .value").removeClass('highlight');
    }, 500);
  };

  const send = function(obj) {
    const message = JSON.stringify(obj);
    $('ul.feed-list').prepend('<li>SENT: <code>' + message + '</code></li>');
    socket.send(message);
  }

  $('.btn-subscribe').on('click', function() {
    const parent = $(this).closest('.vehicle-value');
    const path = parent.data('value');

    send({
      action: 'subscribe',
      path: path
    });

    $(this).hide();
    $(parent).find('.btn-unsubscribe').show();
  });

  $('.btn-unsubscribe').on('click', function() {
    const parent = $(this).closest('.vehicle-value');
    const path = parent.data('value');

    send({
      action: 'unsubscribe',
      path: path
    });

    $(this).hide();
    $(parent).find('.btn-subscribe').show();
  });

  $('.btn-get').on('click', function() {
    const parent = $(this).closest('.vehicle-value');
    const path = parent.data('value');

    send({
      action: 'get',
      path: path
    });
  });

  $('.btn-unsubscribe').hide();
});