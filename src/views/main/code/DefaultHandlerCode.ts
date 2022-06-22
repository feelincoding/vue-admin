export const defaultHanlderCode = `package com.ktds.act.apigw.filter.handler.request.convertBody;

import java.util.Map;
import org.springframework.stereotype.Component;
import com.ktds.act.apigw.filter.handler.RouteHandler;
import com.ktds.act.apigw.filter.model.TransactionDto;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component(value = "REQ.CONVERT-BODY")
public class RequestConvertBodyHandler implements RouteHandler {

  @Override
	public boolean init(Map<String, Object> configMap) {
		log.info("REQ.CONVERT-BODY - Init");
		return true;
	}
	@Override
	public boolean process(TransactionDto transaction) {
		log.info("REQ.CONVERT-BODY - Start");

		// if(transaction.getRequestData().getBody()!=null){
		// 	log.info("요청 바디 : " + new String(transaction.getRequestData().getBody(), Charset.forName("UTF-8")));
		// 	log.info("바디 정보 변경 : request");
		// 	transaction.getRequestData().setBody("request".getBytes(Charset.forName("UTF-8")));
		// }
		log.info("REQ.CONVERT-BODY - End");
		return true;
	}
}`;
