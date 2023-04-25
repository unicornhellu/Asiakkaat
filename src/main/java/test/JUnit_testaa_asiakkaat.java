package test;

import static org.junit.jupiter.api.Assertions.*;
import java.util.ArrayList;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import model.Asiakas;
import model.dao.Dao;

@TestMethodOrder(OrderAnnotation.class)
class JUnit_testaa_asiakkaat {

	@Test
	@Order(1) 
	public void testPoistaKaikkiAsiakkaat() {
		Dao dao = new Dao();
		dao.removeAllItems("foobar");
		ArrayList<Asiakas> asiakkaat = dao.getAllItems();
		assertEquals(0, asiakkaat.size());		
	}
	
	@Test
	@Order(2) 
	public void testLisaaAsiakkaat() {
		Dao dao = new Dao();
		Asiakas asiakas_1 = new Asiakas("Maija", "Meikäläinen", "02-8952786", "maija@msdfa.de");
		Asiakas asiakas_2 = new Asiakas("Petteri", "Punakuono", "01-7383045", "puna@korvatunturi.fi");
		Asiakas asiakas_3 = new Asiakas("Väisi", "Vemmelsääri", "040-65732592", "väpä@bjkbk.fi");
		assertEquals(true, dao.addItem(asiakas_1)); //tai assertTrue(dao.addItem(asiakas_1));	
		assertEquals(true, dao.addItem(asiakas_2));
		assertEquals(true, dao.addItem(asiakas_3));	
		assertEquals(3, dao.getAllItems().size());		
	}
	
	@Test
	@Order(3) 
	public void testMuutaAsiakas() {
		Dao dao = new Dao();		
		ArrayList<Asiakas> asiakkaat = dao.getAllItems("Vemmelsääri");		
		asiakkaat.get(0).setEtunimi("Väiski");		
		dao.changeItem(asiakkaat.get(0));
		asiakkaat = dao.getAllItems("Väiski");
		assertEquals("Väiski", asiakkaat.get(0).getEtunimi());
		assertEquals("Vemmelsääri", asiakkaat.get(0).getSukunimi());
		assertEquals("050-7652735", asiakkaat.get(0).getPuhelin());
		assertEquals("väiski@kirje.fi", asiakkaat.get(0).getSposti());		
	}
	
	@Test
	@Order(4) 
	public void testPoistaAsiakas() {
		Dao dao = new Dao();
		ArrayList<Asiakas> asiakkaat = dao.getAllItems("Väiski");
		dao.removeItem(asiakkaat.get(0).getAsiakas_id());
		assertEquals(0, dao.getAllItems("Väiski").size());					
	}
	
	@Test
	@Order(5) 
	public void testHaeOlematonAsiakas() {
		//Haetaan auto,jonka id on -1
		Dao dao = new Dao();
		assertNull(dao.getItem(-1));
	}
}
