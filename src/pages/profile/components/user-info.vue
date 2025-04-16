<template>
    <div class="user-info px-12  mt-4 mb-10">
        <div class="avatar w-44 h-44 rounded-full"></div>
        <div class="info-box">
            <div class="name">userName</div>
            <div class="id flex-center">ID:123123 <img  class="w-14 h-14 ml-8" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAYAAAC4JqlRAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADcSURBVHgB7ZbPCcIwFId/iSn06AgdoSO4ggMo9iQ9KDiBblA8SI8GxHtHcARHyAgeC5Y+I3ooiNi0YhXfB0kgf+Dj5ZEX4N8RLpuTdBtIqAkaIkBmHo91dU7BCRVIKZZoComD7XV1SqJjHCNQGEGedjlBEiHItncILOLI2CFyObNOdyt7bfUFks0+hCz7aEVh7rIveRBQHiU2WQZoAZW9a5R0nb2dJyELsAALsAALOJZjd6TEUdCtLghBBp8WmE1HmR2yZ+ucAyzAAt/3EBXeeejnaPUrzn2cwPwKFxW7LTg5Kt77AAAAAElFTkSuQmCC" alt="id"></div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.user-info{
    width: 100%;
    background: var(-bg);
    display: flex;
    align-items: center;
    gap:6px;
    .avatar{
        flex-shrink: 0;
        background: white;
    }
    .info-box{
        flex:1;
        color:var(--van-text);
        .name{
            font-size: 16px;
            line-height: 20px;
        }
        .id{
            font-size: 14px;
        }
    }
}
</style>