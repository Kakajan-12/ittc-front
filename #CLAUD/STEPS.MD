we have this file C:\Users\manda\Desktop\ittc-front\app\[lang]\(site)\agenda
there we render agenda
there we have days tabs adn each day contains sessions

current state of agenda: when we press on agenda entry card we show/hide details..
we must remove on click event from card and add details/hide btn on this card.. if only it has details..
by details i mean description of agenda entry(session) and speakers..
card must look like this C:\Users\manda\Desktop\ittc-front\#CLAUD\session_closed.png
keep in mind that session can contain many sponsors
session card on big screens must look like this C:\Users\manda\Desktop\ittc-front\#CLAUD\session_closed.png
on small screens it must look like this C:\Users\manda\Desktop\ittc-front\#CLAUD\session mobile.png
keep in mind that speakers and spinsors must be sorted by sort order. both has such field
look at mobile card. element on this card placed in a little different order.. folow screenshot ui.

on screenshot C:\Users\manda\Desktop\ittc-front\#CLAUD\session opened.png you can see opened state of session.. on api structure we dont have keynote, so dont use it in session details.. howevere in session we have filed 'moderatorId' if it matches with id of speaker we must render it in separate card as shown on provided screenshot..

also speakers dont contain description field so skipp adding this to speaker card.. dont place it as shown on screenshot..
also make icons of session be one standart size.. now we didnt provided any size, so it may look different.. so add 1 fixed size for all of them in desktop, and 1 fixed size on mobile..
