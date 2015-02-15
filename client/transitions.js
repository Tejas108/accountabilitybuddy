Template.layoutMain.rendered = function(){

    this.find('section')._uihooks = {
        insertElement: function(node, next) {
            $(node)
                //.hide()
                .insertBefore(next)
                .addClass('animated fadeInDown');
        },
        removeElement: function(node) {
            $(node).remove();
        }
    };
};
