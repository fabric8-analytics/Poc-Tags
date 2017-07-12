      var userRespData = {};

      var aggregatedTagList = ["django","urls","python","functional-programming","utilities","flask","wsgi","web-framework","werkzeug","jinja","python27","python36","ansible","ansible-roles","ansible-galaxy","ansible-galaxy-improvement","git","aws-cloudformation","python3","pyowm","python-wrapper","api","openweathermap","openweathermap-api","api-client","pytest","mock","wechat","weixin","whois","ip-address","ipv4","ipv6","rwhois","asn","nic","rir","ietf","rdap","bsd-license","oauth2","provider","emoji","nlp","nltk","pattern","python-3","python-2","natural-language-processing","flask-extensions","flask-cors","cors","bencode","bencode-parser","mysql-db","mysql-client","sql","postgres","sqlalchemy","orm","schemas","kennethreitz","opencv","wrapper","wheel","python-2-7","opencv-python","opencv-contrib-python","precompiled","text-processing","text-parser","python-module","twisted","tor","async-programming","fake","testing","dataset","fake-data","test-data","test-data-generator","cache","data-structures","statistics","data-science","file","queue","json","recursive","mysql","mysql-replication-protocol","mysql-binlog","selenium","webdriver","java","ruby","cython","murmurhash","murmurhash2","twitter","network","http","http-client","nsq","client-library","c","monitoring","ps","top","netstat","cpu","memory","memory-analysis","freebsd","osx","windows","netbsd","openbsd","linux","disk","sensors","windows-service","system-monitoring","process-monitor","money","celery","task-queue","administration","workers","rabbitmq","redis","asynchronous","telegram","bot","chatbot","framework","msgpack","numpy","backport","compatibility","monotonic","clock","machine-learning","deep-learning","artificial-intelligence","ai","spacy","machine-learning-library","wsgi-server","http-server","ipython","debugger","nosql","database","documentdb","bokeh","interactive-plots","javascript","visualization","plotting","plots","sqlite","postgresql","peewee","extension","natural-sort","sorting-interface","scandir","directory","iterator","performance","aiohttp","pyramid","falcon","bottlepy","marshmallow","validation","request-validation","security","hmac","serialization","news","crawler","crawling","scraper","news-aggregator","tensorflow","theano","neural-networks","ssl","hooks","linter","lint","yaml","graphene","graphql","url","url-parsing","rfc-3986","internet","gbdt","gbrt","gbm","distributed-systems","xgboost","automl","automation","scikit-learn","hyperparameter-optimization","model-selection","parameter-tuning","automated-machine-learning","random-forest","gradient-boosting","feature-engineering","parser","mediawiki","wikipedia","datetime","date","time","timezones","infrastructure-as-code","devops","tdd","nagios","docker","tdd-utilities","devops-tools","configuration-management","dotenv","backend","logging","library","proxy","socks-proxy","scrapy","kafka","scraping","distributed","crash-reporting","crash-reports","sentry","sentry-client","relay","sendgrid","email","transactional-emails","slack","events","pysnmp","snmp","snmpv3","mib","docker-engine-api","python-library","docker-swarm","chatterbot","corpus","dialog","language","progressbar","progressmeter","progress-bar","meter","rate","eta","console","terminal","progress","bar","gui","parallel","cli","polyline","dhcp","operations","devtools","swagger","rest","restful","restplus","pyasn1","protocols","network-protocols","deserialization","marshalling","hjson","newsapi","newsfeed","news-feed","api-wrapper","python-api-wrapper","python-api","zeroconf","bonjour","avahi","service-discovery","django-braces","class-based","views","cbvs","cbv","nlp-parsing","probabilistic-parser","scikit-learn-api","forest","tree","scientific-computing","retry","backoff","asyncio","synchronous","exceptions","retrying","decorators","exponential","manipulating-urls","url-manipulation","async","ascii","box","table","openapi","netcdf","pandas","dataframes","data-analysis","pydata","http-mock","http-mocking","fakeweb","dynamic-responses","httpretty","python2","streaming-response","testing-tools","optimization","gaussian-processes","bayesian-optimization","simple","boilerplate","attributes","classes"];

      var users = ["dummy","srikrishana", "tuhin", "bhargava", "harjinder", "mitesh", "sam", "sarah", "jai", "arun", "geetika", "jaysveer", "saket"];

      function setupUser(){
        $("#userSel").empty();
        for(var i =0;i< users.length;i++){
          $("#userSel").append('<option>'+users[i]+'</option>');
        }
      }

      function getUserInfoFunc(ev){
        ev.preventDefault();
        var selUserName = $('#userSel').find(":selected").text();
        //TODO : make get ajax call
        var userData = {"user":""}
        userData.user = selUserName;
        var urlUser = "http://tagging-tag-data.dev.rdu2c.fabric8.io/api/v1/get_user";
        $.ajax({
            type: "POST",
            url: urlUser,
            data: JSON.stringify(userData),
            contentType: "application/json", 
            success: function(response){
                $("#user1").show();
                $("#userTxt").text(selUserName);
                userRespData = response;
                populatePackageList(userRespData.data["package_topic_map"]);
            },
            error: function(err){
                alert("failed to fetch user data" + err);
            }
        });
      }

      function populatePackageList(data){
        $("#package-list").empty();
        var pkgList = Object.keys(data);
        for(var i =0;i<pkgList.length;i++){
            var pkg = pkgList[i];
            var tags = data[pkg];
           $("#package-list").append('<li style="background: ' + (tags.length > 0 ? 'GREEN' : '#fff') + '" class="list-group-item">'+pkgList[i]+'</li>');
        }
      }

      $('#package-list').on('click', 'li', function() {
        var selectedPkg = $(this).text();
        $(this).css("border", "3px solid #000")
        selPackage = $(this);
        $("#selected_tags").text(selectedPkg);
        populateTags(selectedPkg);
      });

      function populateTags(selectedPkg){
        var tags = userRespData.data.package_topic_map[selectedPkg];
        $("#droppable-list").empty();
        $("#tag-list").empty();
        if(tags.length>0){
          for(var i =0;i<tags.length;i++){
            $("#droppable-list").append('<li class="list-group-item draggable ui-state-default">'+tags[i]+'</li>');
          }
          initDragDrop();
        }

        var filterdAggregatedTagList = aggregatedTagList.filter( function ( elem ) {
          return tags.indexOf( elem ) === -1;
        });

        if(filterdAggregatedTagList.length>0){
          for(var i =0;i<filterdAggregatedTagList.length;i++){
            $("#tag-list").append('<li class="list-group-item draggable ui-state-default">'+filterdAggregatedTagList[i]+'</li>');
          }
          initDragDrop();
        }
      }

      function initDragDrop(){
         $( ".draggable" ).draggable({
            appendTo: "body", 
            helper: "clone"
        });

        $( ".droppable" ).droppable({            
            drop: function(event, ui){
                 if($(this).attr('id')=="droppable-list" && $(this).children().length < 4 ){
                  $(this).append(ui.draggable);
                  $(ui.draggable).css({position:'absolute',
                   left: (ui.offset.left - $(this).offset().left) +'px', 
                   top: (ui.offset.top - $(this).offset().top) + 'px'}); 
                 } else if ($(this).attr('id')=="tag-list"){
                  $(this).append(ui.draggable);
                  $(ui.draggable).css({position:'absolute',
                   left: (ui.offset.left - $(this).offset().left) +'px', 
                   top: (ui.offset.top - $(this).offset().top) + 'px'});   
                } else{
                  alert("maximum limit for tagging reached");
                }            
            }
        });

        $( "ul, li" ).disableSelection();
      }

      $(function() {
        $("#user1").hide();
        setupUser(); 
        initDragDrop();
    });

    //TODO : get text on dropped list
    $('#droppable-list li').each(function(i){
        console.log($(this).text()); // This is your rel value
    });

    function myTagSearch() {
        // Declare variables
        var input, filter, ul, li, a, i;
        input = document.getElementById('myInputTags');
        filter = input.value.toUpperCase();
        ul = document.getElementById("tag-list");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

  function myPackageSearch() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInputPackage');
    filter = input.value.toUpperCase();
    ul = document.getElementById("package-list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
  }

  function setTagUpdateFunc(ev){
      var tagdataUpdate = {user:"",data:""};
      var listOfSelectedTag = [];
      $('#droppable-list li').each(function(i){
        console.log($(this).text()); // This is your rel value
        listOfSelectedTag.push($(this).text());
      });
      var curPkg = $("#selected_tags").text();
      userRespData.data.package_topic_map[curPkg] = listOfSelectedTag;
      console.log(userRespData);
      
        var urlTag = "http://tagging-tag-data.dev.rdu2c.fabric8.io/api/v1/submit_user_tags";
        $.ajax({
            type: "POST",
            url: urlTag,
            data: JSON.stringify(userRespData),
            contentType: "application/json", 
            success: function(response){
                alert("success!!");
                selPackage.css("background","green");
                selPackage.css("border", "1px solid #ccc")
            },
            error: function(err){
                alert("failed to tag package :" + err);
            }
        });

      ev.preventDefault();
      
  }

//   function setMannualTagUpdateFunc(ev){
//       var tagTyped = $("#mannualInputTags").val();
//       $("#droppable-list").append('<li class="list-group-item draggable ui-state-default">'+tagTyped+'</li>');
//       initDragDrop();
//   }