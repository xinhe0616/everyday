手写笔记账号密码

xinhe0616

hcq190633

### 数据库汇总

#### 数据库配置

~~~properties
server.port=8080
spring.thymeleaf.cache=false
spring.datasource.name=luobeimarket
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/luobei?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=1
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.maximum-pool-size=15
spring.datasource.hikari.auto-commit=true
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.pool-name=hikariCP
spring.datasource.hikari.max-lifetime=30000
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.connection-test-query=SELECT 1
# mybatis config

mybatis.type-aliases-package=com.mao.entity
mybatis.mapper-locations=classpath:mapper/*Mapper.xml
~~~



#### 所有数据库创建数据汇总

##### 创建日记数据

~~~sql
DROP DATABASE xinhe;
CREATE DATABASE xinhe;

USE xinhe;

CREATE TABLE IF NOT EXISTS `diaryNote`(
   `id` INT NOT NULL AUTO_INCREMENT COMMENT'主键',
   `diaryId`  VARCHAR(20) NOT NULL COMMENT '日记编号',
   `diaryconText` TEXT NOT NULL COMMENT '日记内容',
   PRIMARY KEY ( `id` )
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `diaryNote`(`diaryId`,`diaryconText`)
VALUES("20200327133148","这里是xinhe日记的第一篇文章,今天是2020年03月27号.");

SELECT * FROM `diaryNote`;

DELETE FROM `diaryNote` WHERE  `diaryId` = "20200327133148";

UPDATE `diaryNote` SET `diaryconText` = "已修改" WHERE diaryId = "20200327133148";
~~~

### 所有的pom汇总

#### 有参无参构造

~~~xml
		<!--lombok-->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<version>1.16.10</version>
		</dependency>
~~~

#### 数据库pom

~~~xml
        <!-- 引入 MyBatis 场景启动器，包含其自动配置类及 MyBatis 3 相关依赖 -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>1.3.2</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
~~~

### mapper设置

~~~xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="Mapper类的路径">
    <resultMap id="映射图id" type="实体类的路径">
    </resultMap>
</mapper>
~~~

resultType可以把查询结果封装到pojo类型中，但必须pojo类的属性名和查询到的数据库表的字段名一致。 
 如果sql查询到的字段与pojo的属性名不一致，则需要使用resultMap将字段名和属性名对应起来

```xml
    <!-- 定义主键 ,非常重要。如果是多个字段,则定义多个id -->
    <!-- property：主键在pojo中的属性名 -->
    <!-- column：主键在数据库中的列名 -->
    <id property="id" column="id" />
	<!-- 普通 -->
	<result column="数据库中名字" jdbcType="数据类型" property="实体类中名字" />
```

~~~xml
    <sql id="Base_Column_List">
        admin_user_id, login_user_name, login_password, nick_name, locked
    </sql>
~~~

将多个字符绑定为id

使用<include refid="Base_Column_List" />调用

~~~xml
    <select id="Mapper对应函数名" resultMap="resultMap id">
        select
        <include refid="Base_Column_List" />
        from tb_newbee_mall_admin_user
        where login_user_name = #{userName,jdbcType=VARCHAR} AND login_password=#{password,jdbcType=VARCHAR} AND locked = 0
    </select>
~~~

```xml
    <insert id="addDiary" parameterType="com.mao.entity.Diary">
        INSERT INTO diaryNote(diaryId,diaryContext)
        VALUES(#{userDiaryId},#{userDiaryCOnttext});
    </insert>
    <delete id="deleteDiary" parameterType="java.lang.String">
        DELETE FROM diaryNote WHERE  diaryId = #{userDiaryId};
    </delete>
    <update id="updateDiary" parameterType="com.mao.entity.Diary">
        UPDATE diaryNote SET diaryContext = #{userDiaryContext} WHERE diaryId = #{userDiaryId};
    </update>
    <select id="selectDiary" parameterType="java.lang.String" resultMap="BaseResultMap">
        SELECT diaryconText FROM diaryNote WHERE diaryId=#{userDiaryId};
    </select>
```

