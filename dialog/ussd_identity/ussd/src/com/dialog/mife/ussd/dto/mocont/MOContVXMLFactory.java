package com.dialog.mife.ussd.dto.mocont;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the generated package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class MOContVXMLFactory {


    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: generated
     * 
     */
    public MOContVXMLFactory() {
    }

    /**
     * Create an instance of {@link MOContVxml }
     * 
     */
    public MOContVxml createVxml() {
        return new MOContVxml();
    }

    /**
     * Create an instance of {@link MOContVxml.Form }
     * 
     */
    public MOContVxml.Form createVxmlForm() {
        return new MOContVxml.Form();
    }

    /**
     * Create an instance of {@link MOContVxml.Form.Field }
     * 
     */
    public MOContVxml.Form.Field createVxmlFormField() {
        return new MOContVxml.Form.Field();
    }

}
