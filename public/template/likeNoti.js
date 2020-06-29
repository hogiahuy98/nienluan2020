var likeNoti = `
    <div class="dropdown-item activity-item border-bottom">  
    <a class="text-dark" href="/post/noti/{{_id}}/{{post._id}}">
        <div class="row"> 
        <div class="col-8">
            <p class=""><strong>{{user.username}}</strong> vừa thích ảnh của bạn</p>
            <p>"{{post.caption}}"</p>
        </div>
        <div class="col-4 float-right">
            <img class="float-right" src="{{post.imgUrl}}" height="40rem" width="40rem">
        </div>
        </div>
    </a>
    </div>
`