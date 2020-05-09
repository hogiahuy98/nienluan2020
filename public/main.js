$('#dropdown-avatar').click(function(){
    
})

$("#change-password-form").submit( function(e){
    e.preventDefault();
    var form = $(this);
    if ($("#new-pass").val() != $("#re-new-pass").val()){
        return alert("Mật khẩu mới không khớp");
    }

    $.ajax({
        type: "Post",
        url: "/changepassword/",
        data: form.serialize(),
        success: function(data){
            if (data.success){
                alert("Đổi mật khẩu thành công");
            }
            else alert(data.err);
        }
    })
})