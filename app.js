var bodyParser          =   require("body-parser"),
    methodOverride      =   require("method-override"),
    mongoose            =   require("mongoose"),
    express             =   require("express"),
    app                 =   express(),
    expressSanitizer    =   require("express-sanitizer");
    
    
// Appn config    
mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));





// Mongoose/model config
var blogSchema = new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,   
    created: {type: Date, default: Date.now}
    
});

var Blog = mongoose.model("Blog", blogSchema);


// Restful Routes

app.get("/", function(req, res){
    
    res.redirect("/blogs");
});


// Index Route
app.get("/blogs", function(req, res){
    
    Blog.find({}, function(err, blogs){
       
       if(err){
           console.log("You have an error with a blog");
           console.log(err);
       }
       else{
           
           res.render("index", {blogs: blogs});
           
       }
        
    });
});


// New Route

app.get("/blogs/new", function(req, res){
   
   res.render("new");
    
});




// Create Route

app.post("/blogs", function(req, res){
   
   // Create blog
   // Sanitizing the body
   
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
       
       if(err){
           res.render("new");
       }
       else{
        
        // Redirect  back to the index 
           res.redirect("/blogs");
       }
       
   });
   
    
});


// Show Route
app.get("/blogs/:id", function(req, res){
    
    Blog.findById(req.params.id, function(err, foundBlog){
        
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog});
        }
        
    });
        
});



// Edit Route

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        
        if(err){
                
            res.render("/blogs");    
        }
        else{
            res.render("edit", {blog:foundBlog});
        }
            
        
    });
    
    
});



// Update Route

app.put("/blogs/:id", function(req, res){
     
     // Sanitizing the body
       req.body.blog.body = req.sanitize(req.body.blog.body);
    
    
    // findByIdAndUpdate(id,newData, callback)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        
        if(err){
            
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+ req.body.blog);
        }
        
    });
    
});






// Delete the route
 
app.delete("/blogs/:id", function(req, res){
    
    // Delete the Blog 
    Blog.findByIdAndRemove(req.params.id, function(err){
        
        if(err){
            
            res.redirect("/blogs");
            
        }
        else{
            res.redirect("/blogs");
        }
        
    });
    
    //Redirect somewhere
    
    
});






app.get("*", function(req, res){
     
    res.send("Page not found!");
    
});




app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("Blog App is Running!");
});
