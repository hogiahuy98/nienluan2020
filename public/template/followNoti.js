var followNoti = `
    <div class="dropdown-item activity-item border-bottom">  
    <a class="text-dark" href="/user/noti/{{_id}}/{{post._id}}">
        <div class="row"> 
            <div class="col-8">
                <p class=""><strong>{{user.username}}</strong> đã theo dõi bạn</>
                <p>"{{comment.content}}"</p>
            </div>
            <div class="col-4">
                <img class="float-right" src="{{user.avatar}}" height="40rem" width="40rem">
            </div>
        </div>
    </a>
    </div>
`