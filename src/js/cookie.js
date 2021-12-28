var cookie = {
  SetCookie(val, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = "sakuyo_token=" + val + "; " + expires;
  },
  GetCookie() {
    var name = "sakuyo_token=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) 
    {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0) {
        return c.substring(name.length,c.length);
      }
    }
    return "";
  },
  ClearCookie() {  
    this.SetCookie("", -1);  
  } 
}


export default cookie;