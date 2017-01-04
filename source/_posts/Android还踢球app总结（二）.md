title: Android还踢球app总结（二）
date: 2017-01-03 15:43:14
tags: Android
photos:
---
第二篇介绍下界面设计及其实现。当然是想遵循Material Design。但它不是单单的大色块，或者是某些控件的应用。还有层级、动画之类的设计。我做的呢其实是很简单，而且主要是copy了好多介绍这类设计的demo。比如Google出的一个[Cheesesquare](https://github.com/chrisbanes/cheesesquare)，这个主要是介绍**Android Design library**。然后几乎就按照这样的设计做的。。目前实现了**找组织**模块。
<!--more-->
## 1. 浏览帖子

难点或者说比较新的东西就在这块。
实现效果如下图所示。

<img src="..\Android还踢球app总结（二）\find_all_games.jpg" width="30%" height="30%">

用到的一些控件如下图所示。有**CoordinatorLayout**(design包)、**AppBarLayout**(design包)、**Toolbar**(v7包)、**TabLayout**(design包)、**ViewPager**(v4包)、Fragments、**RecyclerView**(v7包)、**FloatingActionButton**(design包)。它们的位置和层级关系如下。

<img src="..\Android还踢球app总结（二）\find_all_games_wiget.jpg" width="30%" height="30%">

<img src="..\Android还踢球app总结（二）\find_all_games_wiget2.jpg" width="30%" height="30%">

上边的不是最顶层的layout。MainActivity的布局，最外边是**DrawerLayout**，然后里边include了上边的布局，以及一个**NavigationView**。DrawerLayout和NavigationView提供了侧滑菜单。这里就不介绍了。主要介绍下上边的这个布局。

### 1.1 CoordinatorLayout
CoordinatorLayout能够让AppBarLayout和底下的内容同步的移动。还有其他的作用，在[这里](https://android-developers.googleblog.com/2015/05/android-design-support-library.html)有更多的介绍；

### 1.2 AppBarLayout
 AppBarLayout应该和CoordinatorLayout一起使用，并且有一些同级的控件，这样就可以一起滑动；上边那篇文章中也有CoordinatorLayout和AppBarLayout以及Toolbar，还有RecyclerView的应用介绍。

### 1.3 Toolbar 
Toolbar是action bar的一个泛化(generalization)，应该有很多种用法，这里只是用来代替action bar的。[这里](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2014/1118/2006.html)有Toolbar详细的介绍。

自己踩过的坑：首先要将style.xml中resources下style里AppTheme的**windowActionBar**设置为false，**windowNoTitle**设置为true；设置左边的汉堡图标时，按照[这里](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2014/1118/2006.html)介绍的用Toolbar的**setNavigationIcon**就可以，而Cheesesquare的demo里还是先找到了ActionBar的实例，再用**setHomeAsUpIndicator**设置图标的；

### 1.4 TabLayout
TabLayout也是在[这里](https://android-developers.googleblog.com/2015/05/android-design-support-library.html)先介绍的。

我实现时是和下边的ViewPager一起的。就像该文章介绍的，获得TabLayout后，不用**addTab()**了，调用**setupWithViewPager**，和**setTabsFromPagerAdapter**这两个方法，将TabLayout和ViewPager绑定，并从ViewPager中获得相应的tab的名称；

### 1.5 ViewPager
ViewPager允许用户左右滑动以显示不同的数据，需要实现一个**PagerAdapter**产生要显示的数据页面，而ViewPager常常和Fragment一块使用，可以方便的提供和管理每个页面的生命周期，相应的提供的Adapter有**FragmentPagerAdapter**和**FragmentStatePagerAdapter**，后者更适合具有更多的页面的情况（来自官方文档）。

实现时，是建一个FragmentAdapter继承自FragmentPagerAdapter，在构造方法中传入titles（List &lt;String &gt;）(就是tabs的名称)，其中有个方法就是**getPageTitle**，根据postion，返回titles中相应的title，即tab的名字；然后创建一个fragments（List &lt;Fragment&gt;）的List，加入相应的Fragment，同样是在FragmentAdapter的构造方法中传入fragments；这样adapter算是闹好了，最后调用ViewPager的**setAdapter**，传入上边的adapter即可；

### 1.6 RecyclerView
RecyclerView应该是一种更“高级”的ListView，网上也有很多教程，如[这个](http://www.jianshu.com/p/16712681731e)和[这个](http://www.cnblogs.com/kimmy/p/4556240.html)。

实现时，在Fragment中，inflate的布局中就只包含一个RecyclerView的控件（之后增加了一个SwipeRefreshLayout控件，把RecycView包住，但是有时候下拉刷新时总感觉很别扭，上下滑动时没想要刷新，但就会触动刷新，体验不好，找问题？？？）。在Fragment中设置布局管理器**setLayoutManager**，以及适配器**setAdapter**。

主要是Adapter的设计。新建一个RecyclerViewAdapter继承自**RecyclerView.Adapter<RecyclerView.ViewHolder>**。在构造函数中，可以把数据posts（List &lt;Post&gt;）（Post是帖子的实体类）的List传进来。此外还有三个重要的函数**onCreateViewHolder**，**onBindViewHolder**，**getItemViewType**，以及两个**ViewHolder**：**NormalItemHolder**，**GroupItemHolder**；

``` java
    // NormalItemHolder，不带标题（第几周），一个CardView，里边包含其他控件
    // 它是继承自RecyclerView的ViewHolder，构造函数传的参数就是上一行所说布局的view
    public class NormalItemHolder extends RecyclerView.ViewHolder {
        CircleImageView cardUserIcon;
        TextView cardUserName;
        TextView cardInfo;
        TextView cardRemark;
        public final View mView;
        public NormalItemHolder(final View itemView) {
            super(itemView);
            cardUserIcon = (CircleImageView) itemView.findViewById(R.id.card_user_avatar);
            cardUserName = (TextView) itemView.findViewById(R.id.card_user_name);
            cardInfo = (TextView) itemView.findViewById(R.id.card_info);
            cardRemark = (TextView) itemView.findViewById(R.id.card_remark);
            mView = itemView;
            itemView.findViewById(R.id.card_item_container).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showDetail(itemView, getAdapterPosition());
                }
            });
        }
    }

    // GroupItemHolder只比NormalItemHolder多一个标题，所以直接继承NormalItemHolder就行，再额外获取其标题的实例
    public class GroupItemHolder extends NormalItemHolder {
        TextView cardTitle;
        public GroupItemHolder(View itemView) {
            super(itemView);
            cardTitle = (TextView) itemView.findViewById(R.id.card_title);
        }
    }

    // getItemViewType方法根据项目元素的position，返回其ViewHolder的类型，NormalItemHolder，或者GroupItemHolder
    // 这里的逻辑是，首先，第一个项目元素一定是带标题的，其次检查之后每个项目元素的约球的时间（通过查询从构造函数中传过来的posts的相应位置的post）是全年的第几周，查看是否和上一条项目元素相同，若相同就是NormalItemViewHolder，否则是GroupItemViewHolder
    public int getItemViewType(int position) {
        //第一个要第几周
        if (position == 0)
            return GROUP_ITEM;
        //判断一个card要用哪一个布局
        int current = Util.getWeekOfYear(postList.get(position).getDate());
        int prevIndex = position - 1;
        int prev = Util.getWeekOfYear(postList.get(prevIndex).getDate());
        boolean isDifferent;
        if (current == prev) {
            isDifferent = false;
        } else {
            isDifferent = true;
        }
        return isDifferent ? GROUP_ITEM : NORMAL_ITEM;
    }

    // onCreateViewHolder函数接受一个viewGroup，及从getItemViewType函数得到的相应的viewType，根据viewType放回相应项目元素的ViewHolder，NormalItemHolder或者GroupItemHolder
    public RecyclerView.ViewHolder onCreateViewHolder(viewGroup viewGroup, int viewType) {

        if (viewType == NORMAL_ITEM) {
            View view =
                    LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.all_posts_item_card, viewGroup, false);
            return new NormalItemHolder(view);
        } else {
            View view =
                    LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.all_posts_title_item_card, viewGroup, false);
            return new GroupItemHolder(view);
        }
    }

    // onBindViewHolder函数根据项目元素的viewHolder和其postion，将posts中对应的post的数据加入其viweHolder中
    public void onBindViewHolder(RecyclerView.ViewHolder viewHolder, final int position) {
        Post post = postList.get(position);
        if (null == post)
            return;
        if (viewHolder instanceof GroupItemHolder) {
            bindGroupItem(post, (GroupItemHolder) viewHolder);
        } else {
            NormalItemHolder holder = (NormalItemHolder) viewHolder;
            bindNormalItem(post, holder);
        }
    }

```

RecyclerView和ListView类似，所以上边的代码都是针对每个项目元素而言的。至于有多少个应该就根据Adapter的构造函数中传递的数据List中项目的个数而定了吧？
另，**ViewGroup**，**ViewHolder**的概念？？？

## 2. 发帖

发帖的界面就简单多了。如下图所示。

<img src="..\Android还踢球app总结（二）\launch_a_game.jpg" width="30%" height="30%">

一个**ScrollView**包住里边的AppBarLayout、各种TextView、ImageView。当然是ScrollView下是一个LinearLayout，里边在包括AppBarLayout，及4、5个LinearLayout，然后LinearLayout再包括具体的内容。

日期的选择是用的**DatePickerDialog**，时间的选择用的**TimePickerDialog**，赛制的选择用的**AlertDialog.Builder**。

填写手机号是个EditText控件，有个方法**setError**，挺好。

<img src="..\Android还踢球app总结（二）\lauch_a_game2.png" width="30%" height="30%">

另外就是地点的选择，用的高德地图。自己弄得界面很丑，不过搜索、放大啥的都可以用。点击图上的某个地点，有个**onMarkerClick**回调方法，可以获取该地点的经纬度、地址描述，把这些三个信息再返回给发起组织界面的地点的TextView。

<img src="..\Android还踢球app总结（二）\determine_a_location.png" width="30%" height="30%">

有个bug是，打开软件，自动定位，然后查询所在城市当天当时之后的约球信息。所以自己发帖时应该只能够选择所在城市的地点。但是在现在搜索是可以搜索到其他城市的地点的。怎样限制搜索在一个城市内呢？？？

## 3. 查看详情

查看详情的界面也比较简单。

<img src="..\Android还踢球app总结（二）\game_detail.jpg" width="30%" height="30%">

有个问题，[和风天气](http://docs.heweather.com/224292)的天气状况一共有51种，而软件中没有采用和风提供的图标，是在[MaterialUp](https://material.uplabs.com/posts/material-design-weather-icon-set)找的一套图标，而只有24个，所以有的天气情况还没有配相应的图标。

地图上的“在这儿题“，就是一个Marker。

带我去（导航功能）、加入组织、举报功能、跳转微信、电话、短信的功能 还没有实现……