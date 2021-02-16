# GHBlogComments

A simple way to include comments on you blog using GitHub Issues. See my live example below.


## Usage

You will need to have a GitHub repository that hosts issues somewhere. The issues will be your blog's comments. For this example, I will assume that the repository that is hosting your comments/issues is called REPONAME. I will also assume that your GitHub username is USERNAME. For each blog post where you want to include comments, you will need to create an issue in your repository. After creating it, take a note of what the issue number is. For this example, I will assume that the issue number is 42. Then, wherever on your page that you want the comments to appear, simply add the line:

```javacript
<script type="text/javascript" data-repoName="USERNAME/REPONAME" data-issueNumber="42" src="https://jtiosue.github.io/GHBlogComments/ghcomments.js"></script>
```

If you are using Jekyll, I recommend having a variable for each of your posts,

```
---
issueNumber: 42
---
```

and then you can replace `data-issueNumber="42"` with {% raw %}`data-issueNumber="{{ page.issueNumber }}"` {% endraw %}.

**Optional**: You can also provide the attributes `data-bgColor` and `data-titleColor`, but you don't have to. The `data-bgColor` attribute sets the color of the div where the comments are posted. The `data-titleColor` attribute sets the color of the username attributed to the comment.


#### Credits

My javascript file is adapted from [here](https://aristath.github.io/blog/static-site-comments-using-github-issues-api) to specifically serve my purposes.


# Example comment section

Go to [https://jtiosue.github.io/ghblogcomments](https://jtiosue.github.io/GHBlogComments) to see this example live.


<script type="text/javascript" data-repoName="jtiosue/GHBlogComments" data-issueNumber="1" src="https://jtiosue.github.io/GHBlogComments/ghcomments.js"></script>
