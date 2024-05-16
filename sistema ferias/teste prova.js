var temp;
var a1=12;
var a2=77;
var a3=23;

    if(a1>a2){
        temp = a1;
        a1 = a2;
        a2 = temp;
    }

    if(a2>a3){
        temp = a2;
        a2 = a3;
        a3 = temp;
    }

    console.log(a3);