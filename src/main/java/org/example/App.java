package org.example;

import com.google.gson.Gson;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        Gson gson = new Gson();

        System.out.println(gson.toJson("test string 2"));
    }
}
