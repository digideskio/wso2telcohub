/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.uninor.ussd.api.responsebean.sms;

/**
 *
 * @author tharanga_07219
 */
public class StartSubscription {
    
    private deliveryReceiptSubscription deliveryReceiptSubscription;
    
     
    public StartSubscription() {
    }
    
    public deliveryReceiptSubscription getDeliveryReportSubscription() {
            return deliveryReceiptSubscription;
    }


    public void setDeliveryReportSubscription(deliveryReceiptSubscription deliveryReceiptSubscription) {
            this.deliveryReceiptSubscription = deliveryReceiptSubscription;
    }
    
}
