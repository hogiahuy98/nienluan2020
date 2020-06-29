const socket = io("localhost:3000");

socket.on("like", data =>{
    var temp = Mustache.render(likeNoti, data.noti);
    $(".dropdown-activity").prepend(temp);
    $("#noti-count").text(parseInt($("#noti-count").text()) + 1);
    if($("#none-noti").attr('data-display') == "true"){
        $("#none-noti").hide();
        $("#none-noti").attr('data-display') = "false";
    }
})

socket.on("comment", data =>{
    var temp = Mustache.render(commentNoti, data);
    $(".dropdown-activity").prepend(temp);
    $("#noti-count").text(parseInt($("#noti-count").text()) + 1);
    if($("#none-noti").attr('data-display') == "true"){
        $("#none-noti").hide();
        $("#none-noti").attr('data-display') = "false";
    }
})


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
                $("#change-password").modal("toggle");
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
    var postID = $(this).attr('id');
    socket.emit("like", {postID: postID});
    $.ajax({
        url     : "/like/"+ postID,
        method  : "post",
        context : this,
        success : function(data){
            if(data.success){
                $(this).html(`Bỏ thích`);
                $(".like-count"+postID).html(`${data.likeCount} lượt thích`);
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
    var postID = $(this).attr('id');
    $.ajax({
        url     : `/unlike/${postID}`,
        method  : "post",
        context : this,
        success : function(data){
            if(data.success){
                $(this).html(`Thích`);
                $(".like-count"+postID).html(`${data.likeCount} lượt thích`);
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

$(".comment-form").submit(function(event){
    event.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        url: `/comment/${$(this).attr('data-id')}`,
        method: "post",
        data: data,
        context: this,
        success: function(data){
            $(`.comment-area-${$(this).attr('data-id')}`).append(`
                <div class="col-10 ml-3 pt-1 comment">
                    <a href="/user/${data.user._id}" class="text-dark bold">
                        <strong>${data.user.username}</strong>
                    </a>
                    <span>${data.comment.content}</span>
                </div>
            `);
            $(this).find("input").val("");
        }
    })
});

socket.on("test", data => {
    console.log(data.message);
})

$(document).on('click','.follow-button',function () {
    $.ajax({
        url: '/follow/'+ $(this).attr('id'),
        method : "POST",
        context: this,
        success: function(data){
            if(data == "Thất bại"){
                return alert(data);
            }
            $(this).removeClass("btn-outline-primary follow-button");
            $(this).addClass("btn-outline-danger unfollow-button");
            $(this).html("Unfollow");
        }
    });

});

$(document).on('click','.unfollow-button',function () {
    $.ajax({
        url: '/unfollow/'+ $(this).attr('id'),
        method : "POST",
        context: this,
        success: function(data){
            $(this).removeClass("btn-outline-danger unfollow-button");
            $(this).addClass("btn-outline-primary follow-button");
            $(this).html("Follow");
        }
    });

});


socket.on("test123", data => {console.log(data)})