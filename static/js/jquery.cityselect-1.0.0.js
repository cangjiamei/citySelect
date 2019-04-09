    (function(){
        $ = jQuery;
         var cityZone,
         cityOptions,
         $, 
         _ref,
         CityZone,
         selectParent,
         absract,
         __super__,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { 
            for (var key in parent) { 
                if (__hasProp.call(parent, key)) 
                child[key] = parent[key]; 
            } 
            function ctor() { 
                this.constructor = child; 
            } 
            ctor.prototype = parent.prototype;
            child.prototype = new ctor(); 
            child.__super__ = parent.prototype; 
            return child; 
        }
        var noropagation = function(e){
            e.stopPropagation();
            if(e.preventDefault){
                e.preventDefault();
            }else{
                e.returnValue = false;
            }
        }
        abstract = (function() {
            function abstract(form_field, options){
                this.form_field = form_field;
                this.options = options != null ? options : {};
                this.options.advanced= options.advanced ? options.advanced : '';
                this.options.fold= options.fold ? options.fold : false;
                this.options.width= options.width ? options.width : '540px';
                //初始化数据
                this.basicData();
                //初始化html内容
                $(this.form_field).append(this.init());
                //事件初始化
                this.basicEvent();
                this.advancedEvent();
                this.initEvent();
                this.selectEvent();
                //设置选中的值
                this.getValue();
            }
            //初始化省以及城市数据
            abstract.prototype.basicData=function(){
            		var $this=this,
            			$options=this.options,
            			provincedata={},
            			citydata={};
            		if($options.data){
            			$.each($options.data, function(index,obj) {
            				var keyNum=obj.value+'';
            				provincedata[keyNum]=obj;
            				if(obj.city){
            					$.each(obj.city, function(cityindex,cityobj) {
            						cityobj['province']=obj.value;
            						citydata[cityobj.cityvalue]=cityobj;
            					});
            					$options.data[index]['citylength']=obj.city.length;
            				}else{
        						$options.data[index]['citylength']=0;
        						citydata[obj.value]=[{'cityname':obj.name,'cityvalue':obj.value,'province':obj.value}];
        						provincedata[keyNum]['city']=citydata[obj.value];
            				}
            			});
            		}
            		if(this.options.hasOwnProperty('advanced')){
            			$options.advanceddata={};
            			$.each($options.advanced.data, function(index,obj) {
            				$.each(obj.container, function(indexsecond,objsecond) {
            					$options.advanceddata[objsecond.text+'']=objsecond;
            				});
            			});
            		}
            		$options.provincedata=provincedata;
            		$options.citydata=citydata;
            }
            //主体部分代码
            abstract.prototype.init=function(){
            		var $this=this,
            			$option=this.options;
            		if($option.data){
            			return $this.initHtml();
            		}
            }
            abstract.prototype.initHtml=function(){
            		var $this=this,
        				$option=this.options,
        				containerHtml=''
            		//topInput
            		if(!($option.fold)){
        				containerHtml='<div class="citySelect-container">';
        			}else{
        				containerHtml='<div class="citySelect-container" style="display:none">';
        			}
            		var initHtml='<div class="citySelect-item" style="width:'+$option.width+'";>'+
            						$this.selectHtml()+
            						$this.tabHtml()+
            						containerHtml+
            							'<div class="citySelect-container-basic">'+
            								$this.basicHtml()+
            							'</div>'+
            							'<div class="citySelect-container-advanced"  style="display:none">'+
            								$this.advancedHtml()+
            							'</div>'+
            						'</div>'+
            					  '</div>';
            		return initHtml;
            }
            //初始化选择框部分内容
            abstract.prototype.selectHtml=function(){
            		var $this=this,
        			$options=this.options;
        			var selectHtml='<div class="citySelect-select">';
        			if($options.hasOwnProperty('selectValue')&&($options.selectValue.hasOwnProperty('data')||$options.selectValue.hasOwnProperty('province')||$options.selectValue.hasOwnProperty('city'))){
        				if($options.selectValue.hasOwnProperty('data')){
        					for ( var key in $options.selectValue.data){
        						//城市信息
        						var thisProvinceData=$options.provincedata[key];
        						var cityValue=$options.selectValue.data[key].split(',');
        						//城市全选
        						if((!$options.provincedata[key].hasOwnProperty('city'))||(cityValue.length==$options.provincedata[key].city.length)){
        							selectHtml=selectHtml+'<div class="citySelect-select-item" data-province="'+thisProvinceData.value+'" data-type="province">'+
			            							'<span class="citySelect-select-item-name">'+thisProvinceData.name+'</span>'+
			            							'<span class="citySelect-select-item-remove">X</span>'+
			            						'</div>';
        						}else{
        							for(var i in cityValue){
        								var thisCityData=$options.citydata[cityValue[i]];
        								selectHtml=selectHtml+'<div class="citySelect-select-item" data-province="'+thisCityData.province+'" data-type="city" data-city="'+thisCityData.cityvalue+'">'+
				            								'<span class="citySelect-select-item-name">'+thisCityData.cityname+'</span>'+
				            								'<span class="citySelect-select-item-remove">X</span>'+
				            							'</div>';
        							}
        						}
        					}
        				}
        				selectHtml=selectHtml+'<div class="citySelect-clear">清除</div>';
        			}
        			selectHtml=selectHtml+'</div>';
            		return selectHtml;
            }
            //菜单栏切换
            abstract.prototype.tabHtml=function(){
            		var $this=this,
        			$option=this.options;
        			if(!($option.fold)){
        				var tabHtml='<div class="citySelect-tab">'+
				    	                '<div class="citySelect-tab-btn citySelect-tab-basic active">高级选择</div>'+
				    	                '<div class="citySelect-tab-btn citySelect-tab-advanced">快捷选择</div>'+
				    	                '<div class="citySelect-tab-btn citySelect-tab-fold">收起列表</div>'+
				    	            '</div>';
        			}else{
        				var tabHtml='<div class="citySelect-tab">'+
				    	                '<div class="citySelect-tab-btn citySelect-tab-basic">高级选择</div>'+
				    	                '<div class="citySelect-tab-btn citySelect-tab-advanced">快捷选择</div>'+
				    	                '<div class="citySelect-tab-btn citySelect-tab-fold active">收起列表</div>'+
				    	            '</div>';
        			}
            		return tabHtml;
            }
            //basic的内容
            abstract.prototype.basicHtml=function(){
            		var $this=this,
        				$options=this.options,
        				provinceHtml='';
        			var provinceItemHtml='';
        			$.each($options.data,function(index,obj){
        				if($options.hasOwnProperty('selectValue')&&($options.selectValue.hasOwnProperty('data'))){
	        				if($options.selectValue.hasOwnProperty('data')){
	        					if($options.selectValue.data.hasOwnProperty(obj.value)){
	        						var thisProvinceData=$options.provincedata[obj.value];
        							var cityValue=$options.selectValue.data[obj.value].split(',');
	        						//城市全选
	        						if((!$options.provincedata[obj.value].hasOwnProperty('city'))||(cityValue.length==$options.provincedata[obj.value].city.length)){
	        							provinceItemHtml=provinceItemHtml+
        								'<div class="citySelect-container-provinceitem" data-province="'+obj.value+'">'+
        									'<div class="citySelect-checkbox active" data-province="'+obj.value+'" data-text="'+obj.name+'"></div>'+
        									'<div class="citySelect-container-provinceitem-text">'+obj.name+'</div>'+
        								'</div>';
	        						}else{
	        							provinceItemHtml=provinceItemHtml+
        								'<div class="citySelect-container-provinceitem" data-province="'+obj.value+'">'+
        									'<div class="citySelect-checkbox half" data-province="'+obj.value+'" data-text="'+obj.name+'"></div>'+
        									'<div class="citySelect-container-provinceitem-text">'+obj.name+'</div>'+
        								'</div>';
	        						}
	        					}else{
	        						provinceItemHtml=provinceItemHtml+
	        								'<div class="citySelect-container-provinceitem" data-province="'+obj.value+'">'+
	        									'<div class="citySelect-checkbox" data-province="'+obj.value+'" data-text="'+obj.name+'"></div>'+
	        									'<div class="citySelect-container-provinceitem-text">'+obj.name+'</div>'+
	        								'</div>';
	        					}
	        				}else{
	        					provinceItemHtml=provinceItemHtml+
	        								'<div class="citySelect-container-provinceitem" data-province="'+obj.value+'">'+
	        									'<div class="citySelect-checkbox" data-province="'+obj.value+'" data-text="'+obj.name+'"></div>'+
	        									'<div class="citySelect-container-provinceitem-text">'+obj.name+'</div>'+
	        								'</div>';
	        				}
	        			}else{
	        				provinceItemHtml=provinceItemHtml+
	        								'<div class="citySelect-container-provinceitem" data-province="'+obj.value+'">'+
	        									'<div class="citySelect-checkbox" data-province="'+obj.value+'" data-text="'+obj.name+'"></div>'+
	        									'<div class="citySelect-container-provinceitem-text">'+obj.name+'</div>'+
	        								'</div>';
	        			}
        			});
            		provinceHtml=provinceHtml+'<div class="citySelect-container-province" style="width:100%">'+
            							provinceItemHtml+
            						'</div>';
            		return provinceHtml;
            }
            abstract.prototype.cityHtml=function(provinceDom){
            		var $this=this,
        				$options=this.options,
        				provinceDom=provinceDom;
            		var cityData=$options.provincedata[provinceDom.attr('data-province')].city;
            		var cityHtml='';
            		$.each(cityData, function(index,obj) {
            			if($options.getValue[obj.province]&&$options.getValue[obj.province].split(',').indexOf(obj.cityvalue+'')!=-1){
            				cityHtml=cityHtml+'<div class="citySelect-container-cityitem" data-city="'+obj.cityvalue+'">'+
	        									'<div class="citySelect-checkbox active"  data-city="'+obj.cityvalue+'" data-province="'+obj.province+'" data-text="'+obj.cityname+'" ></div>'+
	        									'<div class="citySelect-container-cityitem-text">'+obj.cityname+'</div>'+
	        								'</div>';
            			}else{
            				cityHtml=cityHtml+'<div class="citySelect-container-cityitem" data-city="'+obj.cityvalue+'">'+
	        									'<div class="citySelect-checkbox"  data-city="'+obj.cityvalue+'" data-province="'+obj.province+'" data-text="'+obj.cityname+'" ></div>'+
	        									'<div class="citySelect-container-cityitem-text">'+obj.cityname+'</div>'+
	        								'</div>';
            			}
            		});
            		cityHtml='<div class="citySelect-container-city" style="display:block;width:50%;">'+cityHtml+'</div>';
            		return cityHtml;
            }
            //城市选择
            abstract.prototype.provinceSelectHtml=function(provinceCheckbox){
            		var $thisFiled=$(this.form_field),
            			$citySelect=$thisFiled.find('.citySelect-select'),
            			provinceCheckbox=provinceCheckbox,
            			thisItemHtml='';
            		$citySelect.find('[data-province="'+provinceCheckbox.attr('data-province')+'"]').remove();
            		if(provinceCheckbox.hasClass('active')){
            			thisItemHtml='<div class="citySelect-select-item" data-province="'+provinceCheckbox.attr('data-province')+'" data-type="province">'+
            							'<span class="citySelect-select-item-name">'+provinceCheckbox.attr('data-text')+'</span>'+
            							'<span class="citySelect-select-item-remove">X</span>'+
            						'</div>';
            			$citySelect.append(thisItemHtml);
            		}
            		$citySelect.find('.citySelect-clear').remove();
            		$citySelect.append('<div class="citySelect-clear">清除</div>');
            		this.selectEvent();
            }
            abstract.prototype.citySelectHtml=function(cityCheckbox){
            		var $Options=this.options
            			$thisFiled=$(this.form_field),
            			$citySelect=$thisFiled.find('.citySelect-select'),
            			cityCheckbox=cityCheckbox,
            			provinceActiveCheckbox=$thisFiled.find('.citySelect-container-provinceitem.active').find('.citySelect-checkbox'),
            			provinceData=$Options.provincedata[cityCheckbox.attr('data-province')],
            			thisItemHtml='';
            		//全省选中
            		if(provinceActiveCheckbox.hasClass('active')){
            			$citySelect.find('[data-province="'+provinceData.value+'"]').remove();
            			thisItemHtml='<div class="citySelect-select-item" data-province="'+cityCheckbox.attr('data-province')+'" data-type="province">'+
            							'<span class="citySelect-select-item-name">'+provinceData.name+'</span>'+
            							'<span class="citySelect-select-item-remove">X</span>'+
            						'</div>';
            			$citySelect.append(thisItemHtml);
            		//选中一部分市
            		}else if(provinceActiveCheckbox.hasClass('half')){
            			$citySelect.find('[data-province="'+provinceData.value+'"][data-type="province"]').remove();
            			if($citySelect.find('[data-province="'+provinceData.value+'"][data-type="city"]').length==0){
            				$thisFiled.find('.citySelect-container-cityitem .citySelect-checkbox.active').each(function(){
            					thisItemHtml=thisItemHtml+'<div class="citySelect-select-item" data-province="'+$(this).attr('data-province')+'" data-type="city" data-city="'+$(this).attr('data-city')+'">'+
            							'<span class="citySelect-select-item-name">'+$(this).attr('data-text')+'</span>'+
            							'<span class="citySelect-select-item-remove">X</span>'+
            						'</div>';
            				});
            				$citySelect.append(thisItemHtml);
            			}else{
            				if(cityCheckbox.hasClass('active')){
            					thisItemHtml='<div class="citySelect-select-item" data-province="'+cityCheckbox.attr('data-province')+'" data-type="city" data-city="'+cityCheckbox.attr('data-city')+'">'+
            							'<span class="citySelect-select-item-name">'+cityCheckbox.attr('data-text')+'</span>'+
            							'<span class="citySelect-select-item-remove">X</span>'+
            						'</div>';
            					$citySelect.append(thisItemHtml);
            				}else{
            					$citySelect.find('[data-province="'+provinceData.value+'"][data-city="'+cityCheckbox.attr('data-city')+'"]').remove();
            				}
            			}
            		//没有选
            		}else{
            			$citySelect.find('[data-province="'+provinceData.value+'"]').remove();
            		}
            		$citySelect.find('.citySelect-clear').remove();
            		$citySelect.append('<div class="citySelect-clear">清除</div>');
            		this.selectEvent()
            }
            abstract.prototype.advancedHtml=function(){
            		var $options=this.options,
            			advancedHtml='';
            		if(this.options.hasOwnProperty('advanced')){
            			$.each($options.advanced.data, function(index,obj) {
            				advancedHtml=advancedHtml+'<div class="citySelect-container-advanced-group">';
            				var advancedItemHtml='';
            				$.each(obj.container, function(indexsecond,objsecond) {
            					advancedItemHtml=advancedItemHtml+'<div class="citySelect-container-advanced-item">'+objsecond.text+'</div>'
            				});
            				advancedHtml=advancedHtml+advancedItemHtml+'</div>'
            			});
            		}
            		return advancedHtml;
            }
            abstract.prototype.advancedSelectHtml=function(advancedSelectDom){
            		var $this=this,
            			$options=this.options,
            			$thisFiled=$(this.form_field),
            			advancedSelectDom=advancedSelectDom,
            			$citySelect=$thisFiled.find('.citySelect-select'),
            			$basic=$thisFiled.find('.citySelect-container-basic'),
            			advancedSelectdata=$options.advanceddata[advancedSelectDom.text()],
            			citySelectHtml='';
            		$.each(advancedSelectdata.value, function(index,obj) {
            			//城市
            			if(obj.hasOwnProperty('cityvalue')){
            				//选中城市
            				if($citySelect.find('[data-province="'+obj.value+'"][data-type="province"]').length){
            					citySelectHtml=citySelectHtml+'';
            				}else{
            					if($citySelect.find('[data-province="'+obj.value+'"][data-city="'+obj.cityvalue+'"]').length){
            						citySelectHtml=citySelectHtml+'';
            					}else{
            						if($options.getValue[obj.value]&&(($options.getValue[obj.value].split(',').length+1)==$options.provincedata[obj.value].city.length)){
            							citySelectHtml=citySelectHtml+'<div class="citySelect-select-item" data-province="'+obj.value+'" data-type="province">'+
				            							'<span class="citySelect-select-item-name">'+obj.name+'</span>'+
				            							'<span class="citySelect-select-item-remove">X</span>'+
				            						'</div>';
				            			$citySelect.find('[data-province="'+obj.value+'"]').remove();
			            				$basic.find('.citySelect-container-provinceitem .citySelect-checkbox[data-province="'+obj.value+'"]').addClass('active').removeClass('half');
				            			$basic.find('.citySelect-container-cityitem .citySelect-checkbox[data-province="'+obj.value+'"]').addClass('active');
            						}else{
            							citySelectHtml=citySelectHtml+'<div class="citySelect-select-item" data-province="'+obj.value+'" data-city="'+obj.cityvalue+'" data-type="city">'+
				            							'<span class="citySelect-select-item-name">'+obj.cityname+'</span>'+
				            							'<span class="citySelect-select-item-remove">X</span>'+
				            						'</div>';
				            			$basic.find('.citySelect-container-provinceitem .citySelect-checkbox[data-province="'+obj.value+'"]').addClass('half').removeClass('active');
				            			$basic.find('.citySelect-container-cityitem .citySelect-checkbox[data-city="'+obj.cityvalue+'"]').addClass('active');
            						}
            					}
            				}
            			}else{
            				if($citySelect.find('[data-province="'+obj.value+'"][data-type="province"]').length){
            					citySelectHtml=citySelectHtml+'';
            				}else{
            					citySelectHtml=citySelectHtml+'<div class="citySelect-select-item" data-province="'+obj.value+'" data-type="province">'+
				            							'<span class="citySelect-select-item-name">'+obj.name+'</span>'+
				            							'<span class="citySelect-select-item-remove">X</span>'+
				            						'</div>';
				            	$citySelect.find('[data-province="'+obj.value+'"]').remove();
				            	$basic.find('.citySelect-container-provinceitem .citySelect-checkbox[data-province="'+obj.value+'"]').addClass('active').removeClass('half');
				            	$basic.find('.citySelect-container-cityitem .citySelect-checkbox[data-province="'+obj.value+'"]').addClass('active');
            				}
            			}
            		});
            		$citySelect.append(citySelectHtml);
            		$citySelect.find('.citySelect-clear').remove();
            		$citySelect.append('<div class="citySelect-clear">清除</div>');
            		this.selectEvent()
            }
            abstract.prototype.getValue=function(){
	            	var $options=this.options,
	        			$thisFiled=$(this.form_field);
	        		$options.getValue={};
            		$thisFiled.find('.citySelect-container-basic .citySelect-container-province .citySelect-checkbox.active').each(function() {
            			var cityValue='';
            			$.each($options.provincedata[$(this).attr('data-province')].city,function(index,obj){
            				cityValue=cityValue+obj.cityvalue+',';
            			})
            			cityValue=cityValue.slice(0,cityValue.length-1);
            			$options.getValue[$(this).attr('data-province')]=cityValue;
            		});
            		$thisFiled.find('.citySelect-container-basic .citySelect-container-province .citySelect-checkbox.half').each(function() {
            			var $thisHalf=$(this);
            			var cityValue='';
            			$thisFiled.find('.citySelect-select').find('[data-province="'+$thisHalf.attr('data-province')+'"]').each(function(){
            				cityValue=cityValue+$(this).attr('data-city')+',';
            			});
            			cityValue=cityValue.slice(0,cityValue.length-1);
            			$options.getValue[$(this).attr('data-province')]=cityValue;
            		});
            		return $options.getValue;
            }
            return abstract;
        })();
        $.fn.extend({  
            citySelect:function(options){
                return this.each(function(a,b){
                    var $this, citySelect;
                    $this = $(this);
                    var  formAppend = $this.data('citySelect');
                    if (options === 'destroy' && citySelect) {
                      
                    } else if (!formAppend) {
                        $this.data('citySelect', new CitySelect(this, options));
                    }
                });
            }
        });
        CitySelect = (function(_super) {
            __extends(CitySelect,_super);
            function CitySelect() {
                var formConstructor = CitySelect.__super__.constructor.apply(this, arguments);
                return formConstructor;
            }
            CitySelect.prototype.basicEvent=function(){
            		var $this=this,
            			$thisFiled=$(this.form_field),
	    				$option=this.options;
	    			$thisFiled.on('click','.citySelect-container-provinceitem',function(){
	    				$thisFiled.find('.citySelect-container-basic').find('.citySelect-container-provinceitem').removeClass('active');
	    				$(this).addClass('active');
	    				$thisFiled.find('.citySelect-container-basic').find('.citySelect-container-city').remove();
	    				$thisFiled.find('.citySelect-container-basic').find('.citySelect-container-province').css({
	    					'width':'50%'
	    				});
	    				$thisFiled.find('.citySelect-container-basic').append($this.cityHtml($(this)));
	    			});
	    			//省checkbox
	    			$thisFiled.on('click','.citySelect-container-provinceitem .citySelect-checkbox',function(e){
	    				$(this).removeClass('half');
	    				$thisFiled.find('.citySelect-container-basic').find('.citySelect-container-provinceitem').removeClass('active');
	    				$(this).parent('.citySelect-container-provinceitem').addClass('active');
	    				$thisFiled.find('.citySelect-container-basic').find('.citySelect-container-city').remove();
	    				$thisFiled.find('.citySelect-container-basic').find('.citySelect-container-province').css({
	    					'width':'50%'
	    				});
	    				$thisFiled.find('.citySelect-container-basic').append($this.cityHtml($(this).parent('.citySelect-container-provinceitem')));
	    				if($(this).hasClass('active')){
	    					$(this).removeClass('active');
	    					$thisFiled.find('.citySelect-container-city .citySelect-checkbox').removeClass('active');
	    				}else{
	    					$(this).addClass('active');
	    					$thisFiled.find('.citySelect-container-city .citySelect-checkbox').addClass('active');
	    				}
	    				$this.provinceSelectHtml($(this));
	    				e.stopPropagation();
	    				$this.getValue();
	    			});
	    			//市checkbox
	    			$thisFiled.on('click','.citySelect-container-cityitem .citySelect-checkbox',function(){
	    				if($(this).hasClass('active')){
	    					$(this).removeClass('active');
	    				}else{
	    					$(this).addClass('active');
	    				}
	    				var thisCity=$(this).parent('.citySelect-container-cityitem');
	    				//省下城市长度
	    				var provinceNum=$option.citydata[thisCity.attr('data-city')].province;
	    				var cityLength=$option.provincedata[provinceNum].citylength;
	    				//选中市长度
	    				var citySelectLength=$(this).parents('.citySelect-container-city').find('.citySelect-checkbox.active').length;
	    				//选中省checkbox
	    				var provinceSelectCheckbox=$thisFiled.find('.citySelect-container-provinceitem.active').find('.citySelect-checkbox');
	    				//省部分的按钮变化
	    				if(cityLength==citySelectLength){
	    					provinceSelectCheckbox.removeClass('half');
	    					provinceSelectCheckbox.addClass('active');
	    				}else if(citySelectLength>0){
	    					provinceSelectCheckbox.addClass('half');
	    					provinceSelectCheckbox.removeClass('active');
	    				}else{
	    					provinceSelectCheckbox.removeClass('half').removeClass('active');
	    				}
	    				//储存数据
	    				delete $option.provincedata[provinceNum]['select'];
	    				delete $option.provincedata[provinceNum]['citySelect'];
	    				var citySelectValue='';
	    				if(citySelectLength!=0){
	    					if(cityLength==citySelectLength){
	    						$option.provincedata[provinceNum]['select']=true;
	    					}
    						$thisFiled.find('.citySelect-container-city .citySelect-checkbox.active').each(function(){
    							citySelectValue=citySelectValue+$(this).parent('.citySelect-container-cityitem').attr('data-city')+',';
    						});
    						citySelectValue=citySelectValue.slice(0,citySelectValue.length-1);
    						$option.provincedata[provinceNum]['citySelect']=citySelectValue;
	    				}
	    				$this.citySelectHtml($(this));
	    				$this.getValue();
	    			});
	    			//选中部分
	    			$thisFiled.on('mouseenter mouseleave','.citySelect-select-item',function(e){
	    				var $thisEle=$(this);
	    				if(e.type=='mouseenter'){
	    					$thisEle.find('.citySelect-select-item-remove').show();
	    				}else{
	    					$thisEle.find('.citySelect-select-item-remove').hide();
	    				}
	    			});
            }
            CitySelect.prototype.advancedEvent=function(){
            		var $this=this,
            			$thisFiled=$(this.form_field),
	    				$options=this.options;
	    			$thisFiled.on('click','.citySelect-container-advanced-item',function(){
	    				$this.advancedSelectHtml($(this));
	    				$this.getValue();
	    			});
            }
            CitySelect.prototype.selectEvent=function(){
            		var $this=this,
            			$thisFiled=$(this.form_field),
	    				$options=this.options;
	    			$thisFiled.on('click','.citySelect-select-item-remove',function(){
	    				$thisParent=$(this).parent('.citySelect-select-item');
	    				if($thisParent.attr('data-type')=='province'){
	    					$thisFiled.find('.citySelect-container-provinceitem[data-province="'+$thisParent.attr('data-province')+'"]').find('.citySelect-checkbox').removeClass('active');
	    					$thisFiled.find('.citySelect-container-cityitem .citySelect-checkbox[data-province="'+$thisParent.attr('data-province')+'"]').removeClass('active');
	    				}else if($thisParent.attr('data-type')=='city'){
	    					var getValue=$this.getValue();
	    					if(getValue[$thisParent.attr('data-province')]&&(getValue[$thisParent.attr('data-province')].split(',').length==1)){
	    						$thisFiled.find('.citySelect-container-provinceitem[data-province="'+$thisParent.attr('data-province')+'"]').find('.citySelect-checkbox').removeClass('half');
	    					}
	    					$thisFiled.find('.citySelect-container-cityitem .citySelect-checkbox[data-province="'+$thisParent.attr('data-province')+'"][data-city="'+$thisParent.attr('data-city')+'"]').removeClass('active');
	    				}
	    				$(this).parent('.citySelect-select-item').remove();
	    			});
	    			$thisFiled.on('click','.citySelect-clear',function(){
	    				$thisFiled.find('.citySelect-checkbox').removeClass('active').removeClass('half');
	    				$thisFiled.find('.citySelect-select').html('');
	    				$(this).remove();
	    				$this.getValue();
	    			});
            }
            CitySelect.prototype.initEvent=function(){
            		var $this=this,
            			$thisFiled=$(this.form_field),
	    				$options=this.options;
	    			$thisFiled.on('click','.citySelect-tab-btn',function(){
	    				$thisFiled.find('.citySelect-container').show();
	    				if($(this).hasClass('citySelect-tab-basic')){
	    					$thisFiled.find('.citySelect-tab-btn').removeClass('active');
	    					$(this).addClass('active');
	    					$thisFiled.find('.citySelect-container-basic').show();
	    					$thisFiled.find('.citySelect-container-advanced').hide();
	    				}else if($(this).hasClass('citySelect-tab-advanced')){
	    					$thisFiled.find('.citySelect-tab-btn').removeClass('active');
	    					$(this).addClass('active');
	    					$thisFiled.find('.citySelect-container-basic').hide();
	    					$thisFiled.find('.citySelect-container-advanced').show();
	    				}else{
	    					if($(this).hasClass('active')){
	    						$(this).removeClass('active');
	    						$thisFiled.find('.citySelect-container').show();
	    					}else{
	    						$(this).addClass('active');
	    						$thisFiled.find('.citySelect-container').hide();
	    					}
	    				}
	    			});
            }
            return CitySelect;
        })(abstract);
        //获取数据
       $.extend($.fn.citySelect(),{
            'getValue':function(){
       			if($(this).data('citySelect')){
       				return $(this).data('citySelect').options.getValue;
       			}
       		},
       		'getProvince':function(){
       			if($(this).data('citySelect')){
       				var provinceValue='';
       				for(var key in $(this).data('citySelect').options.getValue){
       					provinceValue=provinceValue+','+key
       				}
       				return provinceValue.slice(1,provinceValue.length);
       			}
       		},
       		'getCity':function(){
       			if($(this).data('citySelect')){
       				var cityValue='';
       				for(var key in $(this).data('citySelect').options.getValue){
       					cityValue=cityValue+','+$(this).data('citySelect').options.getValue[key];
       				}
       				return cityValue.slice(1,cityValue.length);
       			}
       		}
        });
    }).call(this);