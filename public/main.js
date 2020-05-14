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

$('.update-post').click( function(){
    var text    = $(this).parent().parent().parent().parent().find('.caption').text();
    var hi      = $(this).parent().attr('aria-labelledby');
        hi      = hi.substring(4, hi.length);
    $("#update-area").val(text);
    $("#update-post").find('form').attr('data-hi', hi);
})

$("#update-form").submit( function(e){
    e.preventDefault();
    var form = $(this);

    $.ajax({
        type: "Post",
        url : "/updatePost/" + $(this).attr('data-hi'),
        data: form.serialize(),
        success: function(data){
            if (data.success){
                $(`.${data.class}`).find('.caption').text(data.caption);
                $('#update-post').modal('toggle');
                alert("chỉnh sửa thành công");
            }
            else alert(data.err);
        }
    })
})

$(document).on('click', '.like', function() {
    $.ajax({
        url     : "/like/"+ $(this).attr('id'),
        method  : "post",
        context : this,
        success : function(data){
            if(data.success){
                $(this).html(`Bỏ thích`);
                $(".like-count").html(`${data.likeCount} lượt thích`);
                $(this).removeClass("like");
                $(this).addClass('unlike');
            }
            else{
                alert(data);
            }
        }
    });
});

$(document).on('click', '.unlike', function(){
    $.ajax({
        url     : `/unlike/${$(this).attr('id')}`,
        method  : "post",
        context : this,
        success : function(data){
            if(data.success){
                $(this).html(`Thích`);
                $(".like-count").html(`${data.likeCount} lượt thích`);
                $(this).removeClass("unlike");
                $(this).addClass('like');
            }
            else{
                alert(data);
            }
        }
    });
});

$(document).on('click', '.unfollow-in-post', function(){
    $.ajax({
        url     : `/unfollowByUsername/${$(this).attr('data-owner')}`,
        method  : "post",
        context : this,
        success : function(data){
            if (data.success){
                alert("Bỏ theo dõi thành công");
                $(`.${$(this).attr('data-owner')}`).hide();
            }
        }
    })
})

$('.delete-post-toggle').click( function(){
    var postID = $(this).attr('id').substring(6, $(this).attr('id').length);
    $('.delete-post-submit').attr('data-hi', postID);
})

$(document).on('click', '.delete-post-submit', function(){
    var postID = $(this).attr('data-hi');
    $.ajax({
        url: `/deletePost/${postID}`,
        method: "post",
        context: this,
        success: function(data){
            if(data.success){
                $(`#post${postID}`).hide();
                $("#delete-post").modal('toggle');
            }
            else{
                alert("Đã có lỗi!");
                $("#delete-post").modal('toggle');
            }
        }
    })
})