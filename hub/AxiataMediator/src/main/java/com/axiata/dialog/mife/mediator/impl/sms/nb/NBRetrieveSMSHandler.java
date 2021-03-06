package com.axiata.dialog.mife.mediator.impl.sms.nb;

import com.axiata.dialog.mife.mediator.impl.sms.*;
import com.axiata.dialog.mife.mediator.OperatorEndpoint;
import com.axiata.dialog.mife.mediator.entity.nb.InboundSMSMessage;
import com.axiata.dialog.mife.mediator.entity.nb.NBRetrieveRequest;
import com.axiata.dialog.mife.mediator.entity.nb.NBRetrieveResponse;
import com.axiata.dialog.mife.mediator.entity.nb.Registrations;
import com.axiata.dialog.mife.mediator.internal.APICall;
import com.axiata.dialog.mife.mediator.internal.ApiUtils;
import com.axiata.dialog.mife.mediator.internal.AxiataType;
import com.axiata.dialog.mife.mediator.internal.AxiataUID;
import com.axiata.dialog.mife.mediator.mediationrule.OriginatingCountryCalculatorIDD;
import com.axiata.dialog.oneapi.validation.AxiataException;
import com.axiata.dialog.oneapi.validation.IServiceValidate;
import com.axiata.dialog.oneapi.validation.impl.ValidateNBRetrieveSms;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.apache.axiom.soap.SOAPBody;
import org.apache.axis2.AxisFault;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.synapse.MessageContext;
import org.apache.synapse.core.axis2.Axis2MessageContext;
import org.json.JSONObject;

public class NBRetrieveSMSHandler implements SMSHandler {

    private static Log log = LogFactory.getLog(NBRetrieveSMSHandler.class);
    private static final String API_TYPE = "sms";
    private OriginatingCountryCalculatorIDD occi;
    private ApiUtils apiUtil;
    private SMSExecutor executor;

    public NBRetrieveSMSHandler(SMSExecutor executor) {
        this.executor = executor;
        occi = new OriginatingCountryCalculatorIDD();
        apiUtil = new ApiUtils();
    }

    @Override
    public boolean handle(MessageContext context) throws AxiataException, AxisFault, Exception {

        SOAPBody body = context.getEnvelope().getBody();
        Gson gson = new GsonBuilder().serializeNulls().create();
        //SOAPHeader soapHeader = context.getEnvelope().getHeader();
        //System.out.println(soapHeader.toString());

        String reqType = "retrive_sms";
        String requestid = AxiataUID.getUniqueID(AxiataType.SMSRETRIVE.getCode(), context, executor.getApplicationid());
        //String appID = apiUtil.getAppID(context, reqType);

        int batchSize = 100;

        JSONObject jsonBody = executor.getJsonBody();
        NBRetrieveRequest nbRetrieveRequest = gson.fromJson(jsonBody.toString(), NBRetrieveRequest.class);
        log.debug("-------------------------------------- Retrieve messages sent to your Web application --------------------------------------");
        log.debug("Retrieve northbound request body : " + gson.toJson(nbRetrieveRequest));

        List<OperatorEndpoint> endpoints = occi.getAPIEndpointsByApp(API_TYPE, executor.getSubResourcePath(),
                executor.getValidoperators());

        List<OperatorEndpoint> validEndpoints = new ArrayList<OperatorEndpoint>();
        Registrations[] registrations = nbRetrieveRequest.getInboundSMSMessages().getRegistrations();

        if (nbRetrieveRequest.getInboundSMSMessages().getMaxBatchSize() != null) {
            String requestBodyBatchSize = nbRetrieveRequest.getInboundSMSMessages().getMaxBatchSize();

            if (!requestBodyBatchSize.equals("")) {
                if (Integer.parseInt(requestBodyBatchSize) < 100) {
                    batchSize = Integer.parseInt(requestBodyBatchSize);
                }
            }
        }

        for (OperatorEndpoint operatorEndpoint : endpoints) {

            for (int i = 0; i < registrations.length; i++) {
                if (registrations[i].getOperatorCode().equalsIgnoreCase(operatorEndpoint.getOperator())) {
                    validEndpoints.add(operatorEndpoint);
                    break;
                }
            }
        }

        log.debug("Endpoints size: " + validEndpoints.size());

        Collections.shuffle(validEndpoints);
        int perOpCoLimit = batchSize / (validEndpoints.size());

        log.debug("Per OpCo limit :" + perOpCoLimit);

        /*JSONArray results = new JSONArray();*/
        List<InboundSMSMessage> inboundSMSMessageList = new ArrayList<InboundSMSMessage>();

        /**
         * TODO FIX
         */
        int count = 0;
        /**
         * TODO FIX
         */
        ArrayList<String> responses = new ArrayList<String>();
        while (inboundSMSMessageList.size() < batchSize) {
            OperatorEndpoint aEndpoint = validEndpoints.remove(0);
            validEndpoints.add(aEndpoint);
            String url = aEndpoint.getEndpointref().getAddress();
            String getRequestURL = null;
            String criteria = null;
            String operatorCode = null;

            for (int i = 0; i < registrations.length; i++) {
                if (registrations[i].getOperatorCode().equalsIgnoreCase(aEndpoint.getOperator())) {
                    /*create request url for southbound operators*/
                    if (registrations[i].getCriteria() != null) {
                        criteria = registrations[i].getCriteria();
                    }

                    if (criteria == null || criteria.equals("")) {
                        operatorCode = registrations[i].getOperatorCode();
                        getRequestURL = "/" + registrations[i].getRegistrationID() + "/messages?maxBatchSize=" + batchSize;
                        url = url.replace("/messages", getRequestURL);
                        log.debug("Invoke RetrieveSMSHandler of plugin");
                    } else {
                        operatorCode = registrations[i].getOperatorCode();
                        getRequestURL = "/" + registrations[i].getRegistrationID() + "/" + criteria + "/messages?maxBatchSize=" + batchSize;
                        url = url.replace("/messages", getRequestURL);
                        log.debug("Invoke SBRetrieveSMSHandler of plugin");
                    }

                    break;
                }
            }

            APICall ac = apiUtil.setBatchSize(url, body.toString(), reqType, perOpCoLimit);
            //String url = aEndpoint.getAddress()+getResourceUrl().replace("test_api1/1.0.0/", "");//aEndpoint
            // .getAddress() + ac.getUri();
            JSONObject obj = ac.getBody();
            String retStr = null;
            log.debug("Retrieving messages of operator: " + aEndpoint.getOperator());

            context.setDoingGET(true);
            if (context.isDoingGET()) {
                log.debug("Doing makeGetRequest");
                retStr = executor.makeGetRequest(aEndpoint, ac.getUri(), null, true, context);
            } else {
                log.debug("Doing makeRequest");
                retStr = executor.makeRequest(aEndpoint, ac.getUri(), obj.toString(), true, context);
            }

            log.debug("Retrieved messages of " + aEndpoint.getOperator() + " operator: " + retStr);

            if (retStr == null) {
                count++;
                if (count == validEndpoints.size()) {
                    log.debug("-------------------------------------------------> Break because count == validEndpoints.size() ------> count :" + count + " validEndpoints.size() :" + validEndpoints.size());
                    break;
                } else {
                    continue;
                }
            }

            /*add criteria and operatorCode to the southbound response*/
            NBRetrieveResponse sbRetrieveResponse = gson.fromJson(retStr, NBRetrieveResponse.class);

            if (sbRetrieveResponse != null) {
                InboundSMSMessage[] inboundSMSMessageResponses = sbRetrieveResponse.getInboundSMSMessageList().getInboundSMSMessage();

                for (int i = 0; i < inboundSMSMessageResponses.length; i++) {
                    inboundSMSMessageResponses[i].setCriteria(criteria);
                    inboundSMSMessageResponses[i].setOperatorCode(operatorCode);

                    inboundSMSMessageList.add(inboundSMSMessageResponses[i]);
                }
                sbRetrieveResponse.getInboundSMSMessageList().setInboundSMSMessage(inboundSMSMessageResponses);
                responses.add(gson.toJson(sbRetrieveResponse));
            }

            count++;
            if (count == (validEndpoints.size() * 2)) {
                log.debug("-------------------------------------------------> Break because count == (validEndpoints.size() * 2) ------> count :" + count + " (validEndpoints.size() * 2) :" + validEndpoints.size() * 2);
                break;
            }
        }

        log.debug("Final value of count :" + count);
        log.debug("Results length of retrieve messages: " + inboundSMSMessageList.size());

        JSONObject paylodObject = apiUtil.generateResponse(context, reqType, inboundSMSMessageList, responses, requestid);
        String strjsonBody = paylodObject.toString();

        /*create northbound response. add clientCorrelator and resourceURL*/
        NBRetrieveResponse nbRetrieveResponse = gson.fromJson(strjsonBody, NBRetrieveResponse.class);
        nbRetrieveResponse.getInboundSMSMessageList().setClientCorrelator(nbRetrieveRequest.getInboundSMSMessages().getClientCorrelator());
        String resourceURL = nbRetrieveResponse.getInboundSMSMessageList().getResourceURL();
        InboundSMSMessage[] inboundSMSMessageResponses = nbRetrieveResponse.getInboundSMSMessageList().getInboundSMSMessage();
        for (int i = 0; i < inboundSMSMessageResponses.length; i++) {
            String operatorCode = inboundSMSMessageResponses[i].getOperatorCode();
            String sestinationAddress = inboundSMSMessageResponses[i].getDestinationAddress();
            String messageId = inboundSMSMessageResponses[i].getMessageId();
            String inResourceURL = resourceURL.replace("registrations/", "registrations/" + operatorCode + "/" + sestinationAddress + "/") + "/" + messageId;
            inboundSMSMessageResponses[i].setResourceURL(inResourceURL);
        }
        nbRetrieveResponse.getInboundSMSMessageList().setInboundSMSMessage(inboundSMSMessageResponses);

        executor.removeHeaders(context);
        executor.setResponse(context, gson.toJson(nbRetrieveResponse));
        ((Axis2MessageContext) context).getAxis2MessageContext().setProperty("messageType", "application/json");

        return true;
    }

    @Override
    public boolean validate(String httpMethod, String requestPath, JSONObject jsonBody, MessageContext context) throws Exception {
        if (!httpMethod.equalsIgnoreCase("POST")) {
            ((Axis2MessageContext) context).getAxis2MessageContext().setProperty("HTTP_SC", 405);
            throw new Exception("Method not allowed");
        }

        if (httpMethod.equalsIgnoreCase("POST")) {
            IServiceValidate validator;
            validator = new ValidateNBRetrieveSms();
            validator.validateUrl(requestPath);
            validator.validate(jsonBody.toString());
        }

        return true;
    }
}
