$(document).ready(function() {
	loadSearchShortCodesCombo();
	loadSearchDesCombo();
	$("#filter_txt_code").val('dummy_code');
	$("#filter_txt_desc").val('dummy_des');
});

$(document)
		.ready(
				function() {
					loadShortCodesData();
					$("#filter_txt_code").select2();
					$("#filter_txt_desc").select2();

					// Create new row to add data
					$("#add_new_row_button")
							.click(
									function() {
										row = $("<tr></tr>");
										col1 = $('<td class="editable_td"><input type="text" class="required number shortcode_exist" placeholder="Ex: 7788" /></td>');
										col2 = $('<td class="editable_td"><input type="text" class="required" placeholder="Ex: Tesing number" /></td>');
										col3 = $('<td class="da-icon-column"><input type="hidden" class="row_data_key" value="" /><a title="Save" class="save_data_icon"><img src="/sandbox/site/themes/default/images/icons/color/disk.png"/></a><a title="Cancel" class="cancel_added_row"><img src="/sandbox/site/themes/default/images/icons/color/cross.png" /></a></td>');
										row.append(col1, col2, col3).prependTo(
												"#numbers_data_table");
										setTablePagination(0);
									});

					// Cancel newly added row
					$('#data_class_body').on('click', 'a.cancel_added_row',
							function() {
								$(this).closest('tr').remove();
								setTablePagination(0);
							});

					// Making rows editable
					$('#data_class_body')
							.on(
									'click',
									'a.edit_tbl_icon',
									function() {
										// Making rows editable
										$(this).closest('tr').find(
												'td.editable_td').each(
												function() {
													var textval = $(this)
															.text(); // this
													// will
													// be
													// the
													// text
													// of
													// each
													// TD
													// tag

													$(this).addClass(
															"cellEditing");
													$(this).html(
															'<input type="text" value="'
																	+ textval
																	+ ' "/>');
													$(this).children().first()
															.focus();

												});

										var closestTR = $(this).closest('tr');

										$(closestTR.find('td').children()[0])
												.attr("class",
														"required number shortcode_exist");
										$(closestTR.find('td').children()[1])
												.attr("class", "required");

										// Setting action buttons
										$(this).closest('tr').find(
												'td:last-child .edit_tbl_icon')
												.hide();
										$(this)
												.closest('tr')
												.find(
														'td:last-child .delete_tbl_icon')
												.hide();
										$(this)
												.closest('tr')
												.find(
														'td:last-child .save_edit_icon')
												.show();
										$(this)
												.closest('tr')
												.find(
														'td:last-child .reset_edit_icon')
												.show();
									});

					// Save new record
					$('#data_class_body')
							.on(
									'click',
									'a.save_data_icon',
									function() {

										var closestTr = $(this).closest('tr');
										var userid = 1;

										var request_url = "/site/blocks/shortcodes/ajax/shortcodefunctions.jag";
										var responseOk = "";
										var addedId = "";

										if (validationC($(this)) == true) {

											var shortcode = $(
													closestTr.find('td')
															.children()[0])
													.val();
											var description = $(
													closestTr.find('td')
															.children()[1])
													.val();

											jagg
													.post(
															request_url,
															{
																'action' : "SaveShortCode",
																'userid' : userid,
																'shortcode' : shortcode,
																'description' : description
															},
															function(result) {

																// alert(result);

																if (!result.error) {
																	var responseData = result.data
																			.split(",");
																	responseOk = responseData[0];
																	addedId = responseData[1];

																	if (responseOk == "true") {
																		closestTr
																				.find(
																						'td')
																				.children()
																				.each(
																						function() {
																							$(
																									this)
																									.parent()
																									.removeClass(
																											"cellEditing");
																						});

																		closestTr
																				.find(
																						'td:nth-child(1)')
																				.text(
																						shortcode);
																		closestTr
																				.find(
																						'td:nth-child(2)')
																				.text(
																						description);

																		$(
																				'#tableSuccess')
																				.show(
																						'fast');
																		$(
																				'#tableSuccessSpan')
																				.html(
																						'<strong>Success!</strong><br />'
																								+ "Sender Address data saved successfully");
																		$(
																				'#tableSuccess')
																				.delay(
																						4000)
																				.hide(
																						'fast');

																		// Setting
																		// action
																		// buttons
																		closestTr
																				.find(
																						'td:nth-child(3)')
																				.children()
																				.html(
																						"");
																		keyTag = $('<input type="hidden" class="row_data_key" value="'
																				+ addedId
																				+ '" />');
																		data1 = $('<a title="Save" class="save_edit_icon" style="display: none;"><img src="/sandbox/site/themes/default/images/icons/color/disk.png"/></a>');
																		data2 = $('<a title="Reset" class="reset_edit_icon" style="display: none;"><img src="/sandbox/site/themes/default/images/icons/color/arrow_redo.png"/></a>');
																		data3 = $('<a title="Edit" class="edit_tbl_icon"><img src="/sandbox/site/themes/default/images/icons/color/pencil.png"/></a>');
																		data4 = $('<a title="Delete" class="delete_tbl_icon"><img src="/sandbox/site/themes/default/images/icons/color/cross.png" /></a>');
																		closestTr
																				.find(
																						'td:nth-child(3)')
																				.prepend(
																						keyTag,
																						data1,
																						data2,
																						data3,
																						data4);
																		
																		loadSearchShortCodesCombo();
																		loadSearchDesCombo();
																	} else {
																		$(
																				'#tableError')
																				.show(
																						'fast');
																		$(
																				'#tableErrorSpan')
																				.html(
																						'<strong>Error!</strong><br />Server Error occurs while adding <i>'
																								+ shortcode
																								+ '</i>! Please re-try.');
																		$(
																				'#tableError')
																				.delay(
																						4000)
																				.hide(
																						'fast');
																	}
																} else {
																	$(
																			'#tableError')
																			.show(
																					'fast');
																	$(
																			'#tableErrorSpan')
																			.html(
																					'<strong>Error!</strong><br /> Error in saving Sender Address '
																							+ shortcode
																							+ ': '
																							+ result.message);
																	$(
																			'#tableError')
																			.delay(
																					4000)
																			.hide(
																					'fast');
																}
															}, "json");
										}
									});

					// Delete data and remove row
					$('#data_class_body')
							.on(
									'click',
									'a.delete_tbl_icon',
									function() {
										var r = confirm("Are you sure you want to Delete selected record?");
										if (r == true) {
											var closestTr = $(this).closest(
													'tr');
											var key = closestTr.find(
													'.row_data_key').val();
											var request_url = "/site/blocks/shortcodes/ajax/shortcodefunctions.jag";

											// alert("Deleting key: "+key);

											jagg
													.post(
															request_url,
															{
																'action' : "DeleteShortCode",
																'id' : key
															},
															function(result) {
																if (!result.error) {

																	$(
																			'#tableSuccess')
																			.show(
																					'fast');
																	$(
																			'#tableSuccessSpan')
																			.html(
																					'<strong>Success!</strong><br />'
																							+ "Sender Address data updated successfully");
																	$(
																			'#tableSuccess')
																			.delay(
																					4000)
																			.hide(
																					'fast');

																	closestTr
																			.remove();
																	loadSearchShortCodesCombo();
																	loadSearchDesCombo();
																} else {
																	$(
																			'#tableError')
																			.show(
																					'fast');
																	$(
																			'#tableErrorSpan')
																			.html(
																					'<strong>Error!</strong><br /> Error in deleting Sender Address: '
																							+ result.message);
																	$(
																			'#tableError')
																			.delay(
																					4000)
																			.hide(
																					'fast');
																}
															}, "json");
											setTablePagination(0);
										}
									});

					// Save modified row data
					$('#data_class_body')
							.on(
									'click',
									'a.save_edit_icon',
									function() {

										var closestTR = $(this).closest('tr');

										if (validationC($(this)) == true) {

											var key = closestTR.find(
													'.row_data_key').val()
													.trim();
											var code = $(
													closestTR.find('td')
															.children()[0])
													.val();
											var description = $(
													closestTR.find('td')
															.children()[1])
													.val();

											var request_url = "/site/blocks/shortcodes/ajax/shortcodefunctions.jag";
											var responseOk = false;
											jagg
													.post(
															request_url,
															{
																'action' : "EditShortCode",
																'id' : key,
																'code' : code,
																'description' : description
															},
															function(result) {
																// alert(result.data);
																if (!result.error) {
																	if (result.data
																			.trim() == "true") {
																		closestTR
																				.find(
																						'td')
																				.children()
																				.each(
																						function() {
																							$(
																									this)
																									.parent()
																									.removeClass(
																											"cellEditing");
																						});

																		closestTR
																				.find(
																						'td:nth-child(1)')
																				.text(
																						code);
																		closestTR
																				.find(
																						'td:nth-child(2)')
																				.text(
																						description);

																		$(
																				'#tableSuccess')
																				.show(
																						'fast');
																		$(
																				'#tableSuccessSpan')
																				.html(
																						'<strong>Success!</strong><br />'
																								+ "Sender Address updated successfully");
																		$(
																				'#tableSuccess')
																				.delay(
																						4000)
																				.hide(
																						'fast');

																		// Setting
																		// action
																		// buttons
																		closestTR
																				.find(
																						'td:last-child .edit_tbl_icon')
																				.show();
																		closestTR
																				.find(
																						'td:last-child .delete_tbl_icon')
																				.show();
																		closestTR
																				.find(
																						'td:last-child .save_edit_icon')
																				.hide();
																		closestTR
																				.find(
																						'td:last-child .reset_edit_icon')
																				.hide();
																	} else {
																		$(
																				'#tableError')
																				.show(
																						'fast');
																		$(
																				'#tableErrorSpan')
																				.html(
																						'<strong>Error!</strong><br />Server Error occurs while updating <i>'
																								+ code
																								+ '</i>! Please re-try.');
																		$(
																				'#tableError')
																				.delay(
																						4000)
																				.hide(
																						'fast');
																	}
																} else {
																	$(
																			'#tableError')
																			.show(
																					'fast');
																	$(
																			'#tableErrorSpan')
																			.html(
																					'<strong>Error!</strong><br /> Error in updating Short Code '
																							+ code
																							+ ': '
																							+ result.message);
																	$(
																			'#tableError')
																			.delay(
																					4000)
																			.hide(
																					'fast');
																}
															}, "json");
										}
									});

					// Reset clicked row data
					$('#data_class_body')
							.on(
									'click',
									'a.reset_edit_icon',
									function() {
										var closestTr = $(this).closest('tr');
										var request_url = "/site/blocks/shortcodes/ajax/shortcodefunctions.jag";
										var key = closestTr.find(
												'.row_data_key').val();

										jagg
												.post(
														request_url,
														{
															'action' : "SearchCode",
															'id' : key
														},
														function(result) {
															if (!result.error) {
																var responseData = result.data
																		.split(",");

																closestTr
																		.find(
																				'td')
																		.children()
																		.each(
																				function() {
																					$(
																							this)
																							.parent()
																							.removeClass(
																									"cellEditing");
																				});

																closestTr
																		.find(
																				'td:nth-child(1)')
																		.text(
																				responseData[1]);
																closestTr
																		.find(
																				'td:nth-child(2)')
																		.text(
																				responseData[2]);

																// Setting
																// action
																// buttons
																closestTr
																		.find(
																				'td:last-child .edit_tbl_icon')
																		.show();
																closestTr
																		.find(
																				'td:last-child .delete_tbl_icon')
																		.show();
																closestTr
																		.find(
																				'td:last-child .save_edit_icon')
																		.hide();
																closestTr
																		.find(
																				'td:last-child .reset_edit_icon')
																		.hide();

															} else {
																alert("Error! :: "
																		+ result.message);
															}
														}, "json");
									});

					// filter table data
					$("#filter_table_button")
							.click(
									function() {
										var user_id = "1";
										var filter_code = $("#filter_txt_code")
												.val();
										var filter_description = $(
												"#filter_txt_desc").val();
										// alert("filtering: "+filter_code+" ::
										// "+filter_description);

										var request_url = "/site/blocks/shortcodes/ajax/shortcodefunctions.jag";

										if (filter_code == "dummy_code") {
											filter_code = "";
										}

										if (filter_description == "dummy_des") {
											filter_description = "";
										}

										jagg.post(request_url, {
											action : "FilterCodesTable",
											'userid' : user_id,
											'shortcode' : filter_code,
											'description' : filter_description
										}, function(result) {
											// alert(result.data);

											if (!result.error) {
												// alert(result.message);
												loadTableRows(result.data);
											} else {
												// $('#tableError').show('fast');
												// $('#tableErrorSpan').html('<strong>Error!</strong><br
												// />Server Error occurs! Please
												// re-try. : '+result.message);
												// $('#tableError').delay(4000).hide('fast');
											}
										}, "json");
									});

					// Action for table reset button
					$("#reset_table_button").click(function() {
						// /loadShortCodesData();
						$("#filter_txt_code").val('dummy_code');
						$("#filter_txt_desc").val('dummy_des');
						window.location.reload();
					});
				});

function loadShortCodesData() {
	var user_id = "1";
	jagg.post("/site/blocks/shortcodes/ajax/shortcodefunctions.jag", {
		action : "GetTableData",
		userid : user_id
	}, function(result) {
		// alert(result.data);

		if (!result.error) {
			// alert(result.message);
			loadTableRows(result.data);
		} else {
			// $('#tableError').show('fast');
			// $('#tableErrorSpan').html('<strong>Error!</strong><br />Server
			// Error occurs! Please re-try. : '+result.message);
		}
	}, "json");
}

function loadTableRows(rowData) {
	$("#numbers_data_table #data_class_body").empty();
	$("#numbers_data_table #data_class_body").append(rowData);
	setTablePagination(0);
}

// Load short codes search combo
function loadSearchShortCodesCombo() {
	var action = "loadSearchShortCodes";
	jagg.post("/site/blocks/shortcodes/ajax/shortcodefunctions.jag", {
		action : action
	}, function(result) {
		if (!result.error) {
			var nubmers = result.data;
			fillSearchShotrCodesCombo(nubmers);
		} else {
			jagg.showLogin();
		}
	}, "json");
}

function fillSearchShotrCodesCombo(numbers) {
	$('#filter_txt_code option[value!="dummy_code"]').remove();
	var option = '<option></option>';
	var i;
	for (i = 0; i < numbers.length - 1; i++) {
		option += '<option value="'
				+ numbers[i].trim()+ '">'
				+ numbers[i].trim()+ '</option>';
	}
	$('#filter_txt_code').append(option);
};

//Load description search combo
function loadSearchDesCombo() {
	var action = "loadSearchDes";
	jagg.post("/site/blocks/shortcodes/ajax/shortcodefunctions.jag", {
		action : action
	}, function(result) {
		if (!result.error ) {
			var des = result.data;
			fillSearchDesCombo(des);
		} else {
			jagg.showLogin();
		}
	}, "json");
}

function fillSearchDesCombo(des) {
	$('#filter_txt_desc option[value!="dummy_des"]').remove();
	var option = '<option></option>';
	var i;
	for (i = 0; i < des.length - 1; i++) {
		option += '<option value="'
				+ des[i].trim()+ '">'
				+ des[i].trim()+ '</option>';
	}
	$('#filter_txt_desc').append(option);
};

// Paginations
function setTablePagination(pageNumber) {
	paginator(pageNumber);
}

function paginator(pageNumber) {
	var rows = $("#numbers_data_table #data_class_body tr").length;
	var rowsPerPage = 10;
	if (rows > rowsPerPage) {
		var numberOfPages = Math.ceil(rows / rowsPerPage);
		var currentPageStart = pageNumber * rowsPerPage;
		var currentPageEnd = (pageNumber * rowsPerPage) + rowsPerPage;
		for (var i = 0; i < rows; i++) {
			if ((currentPageStart <= i) & (i < currentPageEnd)) {
				$("#numbers_data_table tbody tr").eq(i).show();
				// alert(i);
			} else {
				$("#numbers_data_table tbody tr").eq(i).hide();

			}
		}
		// alert("PAGENUMBER: "+pageNumber+"\nRows: "+rows+"\nRowsPP:
		// "+rowsPerPage+"\nPAGES: "+numberOfPages+"\nSTART:
		// "+currentPageStart+"\nEND: "+currentPageEnd);
		loadPaginatorView(numberOfPages, pageNumber);
	} else {
		$(".pagination").html('');
	}
}

function loadPaginatorView(numberOfPages, currentPage) {
	$(".pagination").html('<ul></ul>');
	var previousAppender = '<li><a href="javascript:paginator(0)"><<</a></li>';
	if (currentPage == 0) {
		previousAppender = '<li class="disabled"><a><<</a></li>';
	}
	$(".pagination ul").append(previousAppender);
	for (var i = 0; i < numberOfPages; i++) {
		var currentRow;
		var rowSticker = i + 1;
		if (i == currentPage) {
			currentRow = '<li class="active"><a>' + rowSticker + '</a></li>';
		} else {
			currentRow = '<li><a href="javascript:paginator(' + i + ')">'
					+ rowSticker + '</a></li>';
		}
		$(".pagination ul").append(currentRow);
	}
	var lastPage = numberOfPages - 1;// alert(lastPage);
	var postAppender = '<li><a href="javascript:paginator(' + lastPage
			+ ')">>></a></li>';
	if (currentPage == lastPage) {
		postAppender = '<li class="disabled"><a>>></a></li>';
	}
	$(".pagination ul").append(postAppender);
}