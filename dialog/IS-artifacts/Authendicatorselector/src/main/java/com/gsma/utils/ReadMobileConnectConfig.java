package com.gsma.utils;

import java.io.File;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import com.gsma.authenticators.dialog.sms.SendSMS;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.wso2.carbon.utils.CarbonUtils;
import org.xml.sax.SAXException;
/**
 * Created by paraparan on 5/13/15.
 */
public class ReadMobileConnectConfig {

    public Map<String, String> query(String XpathExpression) throws ParserConfigurationException, SAXException,
            IOException, XPathExpressionException {
        // standard for reading an XML file
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder;
        Document doc = null;
        XPathExpression expr = null;
        builder = factory.newDocumentBuilder();
        doc = builder.parse(CarbonUtils.getCarbonConfigDirPath() + File.separator + "mobile-connect.xml");

        // create an XPathFactory
        XPathFactory xFactory = XPathFactory.newInstance();

        // create an XPath object
        XPath xpath = xFactory.newXPath();

        // compile the XPath expression
        expr = xpath.compile("//"+ XpathExpression +"/*");
        // run the query and get a nodeset
        Object result = expr.evaluate(doc, XPathConstants.NODESET);
//        // cast the result to a DOM NodeList
        NodeList nodes = (NodeList) result;

        Map<String, String> ConfigfileAttributes = new Hashtable<String, String>();
        for (int i=0; i<nodes.getLength();i++){
            ConfigfileAttributes.put(nodes.item(i).getNodeName(), nodes.item(i).getTextContent());
        }

        return ConfigfileAttributes;
    }

}

